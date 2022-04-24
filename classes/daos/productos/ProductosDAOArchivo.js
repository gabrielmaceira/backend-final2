import ContainerArchivo from "../../containers/ContainerArchivo.js";
import { validateProductInsert } from "../../../helpers/validateProduct.js";

class ProductosDAOArchivo extends ContainerArchivo {
  constructor(fileName) {
    super(fileName);
  }

  formatData(data) {
    if (validateProductInsert(data)) {
      return {
        timestamp: Date.now(),
        nombre: data.nombre,
        descripcion: data.descripcion,
        codigo: data.codigo,
        foto: data.foto,
        precio: Number(data.precio),
        stock: Number(data.stock),
      };
    } else {
      throw new Error("Por favor revisar los valores ingresados.");
    }
  }
}

export default ProductosDAOArchivo;
