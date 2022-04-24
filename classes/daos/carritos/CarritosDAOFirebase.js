import admin from "firebase-admin";
import ContainerFirebase from "../../containers/ContainerFirebase.js";

class CarritosDAOFirebase extends ContainerFirebase {
  constructor() {
    super();
    this.collection = "carritos";
  }

  formatData(data) {
    return { timestamp: Date.now(), productos: [] };
  }

  async addProduct(providedId, newData) {
    try {
      const db = admin.firestore();
      const query = db.collection(this.collection);
      const doc = query.doc(providedId);
      const cart = await doc.get();

      if (!cart._createTime) {
        throw new Error("El id ingresado no existe");
      } else {
        await doc.update({ productos: [...cart.data().productos, newData] });
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteProductInCart(providedCartId, providedItemId) {
    try {
      const db = admin.firestore();
      const query = db.collection(this.collection);
      const doc = query.doc(providedCartId);
      const cart = await doc.get();

      if (!cart._createTime) {
        throw new Error("El id ingresado no existe");
      } else {
        await doc.update({
          productos: cart
            .data()
            .productos.filter((product) => product.id !== providedItemId),
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default CarritosDAOFirebase;
