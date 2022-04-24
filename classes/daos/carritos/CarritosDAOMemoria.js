import ContainerMemoria from "../../containers/ContainerMemoria.js";

class CarritosDAOMemoria extends ContainerMemoria {
  constructor() {
    super();
  }

  formatData(data) {
    return { timestamp: Date.now(), products: [] };
  }

  async addProduct(id, newData) {
    try {
      const cart = await this.getById(id);

      if (!cart) {
        throw new Error("El id ingresado no existe");
      } else {
        if (cart.productos?.length) {
          cart.productos = [...cart.productos, newData];
        } else {
          cart.productos = [newData];
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteProductInCart(cartId, itemId) {
    try {
      const cart = await this.getById(cartId);

      if (!cart) {
        throw new Error("El id del carrito ingresado no existe");
      } else {
        const filteredProducts = cart.productos?.filter(
          (el) => el.id !== itemId
        );

        if (filteredProducts.length === cart.productos?.length) {
          throw new Error("El producto no esta en el carrito");
        } else {
          cart.productos = filteredProducts;
        }
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default CarritosDAOMemoria;
