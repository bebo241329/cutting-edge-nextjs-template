import { beforeEach, describe, expect, it, vi } from "vitest";

const collection = vi.fn();
const getDocs = vi.fn();
const getDoc = vi.fn();
const addDoc = vi.fn();
const updateDoc = vi.fn();
const deleteDoc = vi.fn();
const doc = vi.fn();

const firestoreInstance = { __type: "firestore" };
const collectionRef = { __type: "collection" };

vi.mock("firebase/firestore", () => ({
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
}));

vi.mock("@/lib/firebase/client", () => ({
  getFirebaseFirestore: vi.fn(() => firestoreInstance),
}));

describe("firebase example-entity provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    collection.mockReturnValue(collectionRef);
    doc.mockImplementation((_db, _name, id) => ({ id }));
  });

  it("list maps firestore docs to entities", async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "id-1",
          data: () => ({
            title: "Title",
            body: "Body",
            createdAt: "2026-04-06T00:00:00.000Z",
            updatedAt: "2026-04-06T00:00:00.000Z",
          }),
        },
      ],
    });

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    const result = await createFirebaseExampleEntityProvider().list();

    expect(collection).toHaveBeenCalledWith(firestoreInstance, "example-entities");
    expect(result).toEqual([
      {
        id: "id-1",
        title: "Title",
        body: "Body",
        createdAt: "2026-04-06T00:00:00.000Z",
        updatedAt: "2026-04-06T00:00:00.000Z",
      },
    ]);
  });

  it("get returns mapped entity when doc exists", async () => {
    getDoc.mockResolvedValueOnce({
      id: "id-1",
      exists: () => true,
      data: () => ({
        title: "Title",
        body: "Body",
        createdAt: "2026-04-06T00:00:00.000Z",
        updatedAt: "2026-04-06T00:00:00.000Z",
      }),
    });

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    await expect(createFirebaseExampleEntityProvider().get("id-1")).resolves.toEqual({
      id: "id-1",
      title: "Title",
      body: "Body",
      createdAt: "2026-04-06T00:00:00.000Z",
      updatedAt: "2026-04-06T00:00:00.000Z",
    });
  });

  it("get returns null when doc does not exist", async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    await expect(createFirebaseExampleEntityProvider().get("missing")).resolves.toBeNull();
  });

  it("create persists and returns normalized entity", async () => {
    addDoc.mockResolvedValueOnce({ id: "id-new" });

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    const result = await createFirebaseExampleEntityProvider().create({
      title: "New Title",
      body: "New Body",
    });

    expect(addDoc).toHaveBeenCalledWith(
      collectionRef,
      expect.objectContaining({
        title: "New Title",
        body: "New Body",
      }),
    );
    expect(result).toEqual({
      id: "id-new",
      title: "New Title",
      body: "New Body",
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("update persists and returns normalized entity", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        createdAt: "2026-04-01T00:00:00.000Z",
      }),
    });
    updateDoc.mockResolvedValueOnce(undefined);

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    const result = await createFirebaseExampleEntityProvider().update("id-1", {
      title: "Updated",
      body: "Updated body",
    });

    expect(updateDoc).toHaveBeenCalledWith(
      { id: "id-1" },
      expect.objectContaining({
        title: "Updated",
        body: "Updated body",
      }),
    );
    expect(result).toEqual({
      id: "id-1",
      title: "Updated",
      body: "Updated body",
      createdAt: "2026-04-01T00:00:00.000Z",
      updatedAt: expect.any(String),
    });
  });

  it("remove deletes and returns ok true", async () => {
    getDoc.mockResolvedValueOnce({ exists: () => true });
    deleteDoc.mockResolvedValueOnce(undefined);

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    await expect(createFirebaseExampleEntityProvider().remove("id-1")).resolves.toEqual({
      ok: true,
    });
    expect(deleteDoc).toHaveBeenCalledWith({ id: "id-1" });
  });

  it("remove throws not_found when doc missing", async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false });

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    await expect(createFirebaseExampleEntityProvider().remove("missing")).rejects.toMatchObject({
      code: "not_found",
    });
  });

  it("maps firestore network-like failures to network_error", async () => {
    getDocs.mockRejectedValueOnce({ code: "firestore/unavailable" });

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    await expect(createFirebaseExampleEntityProvider().list()).rejects.toMatchObject({
      code: "network_error",
    });
  });

  it("maps malformed firestore payload to contract_error", async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "id-1",
          data: () => ({
            title: "Title",
            createdAt: "2026-04-06T00:00:00.000Z",
            updatedAt: "2026-04-06T00:00:00.000Z",
          }),
        },
      ],
    });

    const { createFirebaseExampleEntityProvider } = await import(
      "@/lib/example-entity/providers/firebase"
    );

    await expect(createFirebaseExampleEntityProvider().list()).rejects.toMatchObject({
      code: "contract_error",
    });
  });
});
