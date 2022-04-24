import mongoose from "mongoose";
import ContainerMongoDB from "../../containers/ContainerMongoDB.js";
import cartModel from "../../../models/cartSchema.js";

class CarritosDAOMongoDB extends ContainerMongoDB {
  constructor() {
    super();
    this.model = cartModel;
  }

  formatData(data) {
    return { timestamp: Date.now(), productos: [] };
  }

  async addProduct(id, newData) {
    try {
      const URL = this.connectionString;
      mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const objId = mongoose.mongo.ObjectId(id);
      await this.model.updateOne(
        { _id: objId },
        {
          $push: { productos: newData },
        }
      );

      mongoose.disconnect();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteProductInCart(cartId, itemId) {
    try {
      const URL = this.connectionString;
      mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      const convertedCartId = mongoose.mongo.ObjectId(cartId);
      const convertedItemId = mongoose.mongo.ObjectId(itemId);

      const cart = await this.model.findOne({ _id: convertedCartId });

      if (cart?._id === undefined) {
        mongoose.disconnect();
        throw new Error("El id del carrito ingresado no existe");
      } else {
        const cartLength = cart.productos.length;
        cart.productos = cart.productos.filter(
          (el) => el._id.toString() !== convertedItemId.toString()
        );

        if (cart.productos.length === cartLength) {
          throw new Error("El producto no esta en el carrito");
        } else {
          await cart.save();
          mongoose.disconnect();
        }
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default CarritosDAOMongoDB;
