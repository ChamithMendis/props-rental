import { useState, useEffect, useCallback } from "react";
import {
  loadProps,
  saveProps,
  saveProp,
  deleteProp as dbDeleteProp,
  generateId,
} from "../utils/storage";

export function useProps() {
  const [props, setPropsState] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProps()
      .then(setPropsState)
      .finally(() => setLoading(false));
  }, []);

  const persist = useCallback(async (updated) => {
    setPropsState(updated);
    await saveProps(updated);
  }, []);

  const addProp = useCallback(
    async (formData) => {
      const newProp = {
        id: generateId(),
        ...formData,
        images: (formData.images || []).filter(Boolean),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      await saveProp(newProp);
      setPropsState((prev) => [...prev, newProp]);
      return newProp;
    },
    []
  );

  const updateProp = useCallback(
    async (id, formData) => {
      setPropsState((prev) => {
        const updated = prev.map((p) =>
          p.id === id
            ? {
                ...p,
                ...formData,
                images: (formData.images || p.images || []).filter(Boolean),
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : p
        );
        const changed = updated.find((p) => p.id === id);
        if (changed) saveProp(changed);
        return updated;
      });
    },
    []
  );

  const deleteProp = useCallback(async (id) => {
    await dbDeleteProp(id);
    setPropsState((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleAvailability = useCallback((id) => {
    setPropsState((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, available: !p.available, updatedAt: new Date().toISOString().slice(0, 10) }
          : p
      );
      const changed = updated.find((p) => p.id === id);
      if (changed) saveProp(changed);
      return updated;
    });
  }, []);

  const togglePublished = useCallback((id) => {
    setPropsState((prev) => {
      const updated = prev.map((p) =>
        p.id === id
          ? { ...p, published: !(p.published !== false), updatedAt: new Date().toISOString().slice(0, 10) }
          : p
      );
      const changed = updated.find((p) => p.id === id);
      if (changed) saveProp(changed);
      return updated;
    });
  }, []);

  return {
    props,
    loading,
    addProp,
    updateProp,
    deleteProp,
    toggleAvailability,
    togglePublished,
    setProps: persist,
  };
}
