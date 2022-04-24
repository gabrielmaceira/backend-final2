import ContainerMongoDB from "../../containers/ContainerMongoDB.js";
import productModel from "../../../models/productModel.js";
import {
  validateProductInsert,
  validateProductUpdate,
} from "../../../helpers/validateProduct.js";

class ProductosDAOMongoDB extends ContainerMongoDB {
  constructor() {
    super();
    this.model = productModel;
  }

  formatData(data) {
    if (validateProductInsert(data)) {
      const newProduct = {
        ...data,
        precio: Number(data.precio),
        stock: Number(data.stock),
      };
      return newProduct;
    } else {
      throw new Error("{ error: 'Revisar los datos ingresados!' }");
    }
  }

  formatUpdateData(data) {
    if (validateProductUpdate(data)) {
      let finalData = {};

      if (data.precio !== undefined) {
        finalData = { ...data, precio: Number(data.precio) };
      }

      if (data.stock !== undefined) {
        finalData = { ...data, stock: Number(data.stock) };
      }
      return finalData;
    } else {
      throw new Error("{ error: 'Revisar los datos ingresados!' }");
    }
  }
}

export default ProductosDAOMongoDB;
