import { useState, useCallback } from "react";
import { loadProps, saveProps, generateId } from "../utils/storage";

export function useProps() {
  const [props, setProps] = useState(() => loadProps());

  const persist = useCallback((updated) => {
    setProps(updated);
    saveProps(updated);
  }, []);

  const addProp = useCallback(
    (formData) => {
      const newProp = {
        id: generateId(),
        ...formData,
        images: (formData.images || []).filter(Boolean),
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      persist([...props, newProp]);
      return newProp;
    },
    [props, persist]
  );

  const updateProp = useCallback(
    (id, formData) => {
      const updated = props.map((p) =>
        p.id === id
          ? {
              ...p,
              ...formData,
              images: (formData.images || p.images || []).filter(Boolean),
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : p
      );
      persist(updated);
    },
    [props, persist]
  );

  const deleteProp = useCallback(
    (id) => {
      persist(props.filter((p) => p.id !== id));
    },
    [props, persist]
  );

  const toggleAvailability = useCallback(
    (id) => {
      const updated = props.map((p) =>
        p.id === id ? { ...p, available: !p.available, updatedAt: new Date().toISOString().slice(0, 10) } : p
      );
      persist(updated);
    },
    [props, persist]
  );

  const togglePublished = useCallback(
    (id) => {
      const updated = props.map((p) =>
        p.id === id ? { ...p, published: !(p.published !== false), updatedAt: new Date().toISOString().slice(0, 10) } : p
      );
      persist(updated);
    },
    [props, persist]
  );

  return { props, addProp, updateProp, deleteProp, toggleAvailability, togglePublished, setProps: persist };
}
