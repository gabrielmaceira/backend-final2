import isValidHttpUrl from "./isValidHttpUrl.js";

export const validateProductInsert = (data) => {
  return (
    typeof data.nombre === "string" &&
    data.nombre.length > 0 &&
    typeof data.descripcion === "string" &&
    data.descripcion.length > 0 &&
    typeof data.codigo === "string" &&
    data.codigo.length > 0 &&
    !isNaN(Number(data.precio)) &&
    !isNaN(Number(data.stock)) &&
    isValidHttpUrl(data.foto)
  );
};

export const validateProductUpdate = (data) => {
  return (
    ((typeof data.nombre === "string" && data.nombre.length > 0) ||
      data.nombre === undefined) &&
    ((typeof data.descripcion === "string" && data.descripcion.length > 0) ||
      data.descripcion === undefined) &&
    ((typeof data.codigo === "string" && data.codigo.length > 0) ||
      data.codigo === undefined) &&
    (!isNaN(Number(data.precio)) || data.precio === undefined) &&
    (!isNaN(Number(data.stock)) || data.stock === undefined) &&
    (isValidHttpUrl(data.thumbnail) || data.thumbnail === undefined)
  );
};
