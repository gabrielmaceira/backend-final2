import * as fs from "fs";
import ContainerArchivo from "../../containers/ContainerArchivo.js";

class CarritosDAOArchivo extends ContainerArchivo {
  constructor(fileName) {
    super(fileName);
  }

  formatData(data) {
    return { timestamp: Date.now(), productos: [] };
  }

  async addProduct(providedId, newData) {
    try {
      const id = Number(providedId);
      const allCarts = await this.getAll();
      let cartPosition = allCarts.findIndex((cart) => cart.id === id);

      if (cartPosition < 0) {
        throw new Error("El id ingresado no existe");
      } else {
        allCarts[cartPosition].productos = [
          ...allCarts[cartPosition].productos,
          newData,
        ];
        await fs.promises.writeFile(this.fileName, JSON.stringify(allCarts));
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteProductInCart(providedCartId, providedItemId) {
    const cartId = Number(providedCartId);
    const itemId = Number(providedItemId);

    try {
      const allCarts = await this.getAll();
      let cartPosition = allCarts.findIndex((cart) => cart.id === cartId);

      if (cartPosition < 0) {
        throw new Error("El id del carrito ingresado no existe");
      } else {
        const filteredProducts = allCarts[cartPosition].productos.filter(
          (el) => el.id !== itemId
        );

        if (
          filteredProducts.length === allCarts[cartPosition].productos.length
        ) {
          throw new Error("El producto no esta en el carrito");
        } else {
          allCarts[cartPosition].productos = filteredProducts;
          await fs.promises.writeFile(this.fileName, JSON.stringify(allCarts));
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default CarritosDAOArchivo;
