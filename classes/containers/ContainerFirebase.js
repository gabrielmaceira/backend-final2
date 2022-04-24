import admin from "firebase-admin";

class ContainerFirebase {
  constructor() {
    this.collection = "containers";
  }

  formatData(data) {
    return data;
  }

  formatUpdateData(data) {
    return data;
  }

  async save(data) {
    try {
      const db = admin.firestore();
      const query = db.collection(this.collection);

      const formattedData = this.formatData(data);
      const newDoc = query.doc();
      await newDoc.create(formattedData);

      return newDoc._path.segments[1];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getById(id) {
    try {
      const db = admin.firestore();
      const query = db.collection(this.collection);

      const docQuery = query.doc(id);
      const retrievedData = await docQuery.get();
      const foundItem = { id: retrievedData.id, ...retrievedData.data() };

      if (Object.keys(foundItem).length > 1) {
        return foundItem;
      } else {
        throw new Error("{error: 'ID no encontrado'}");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getAll() {
    try {
      const db = admin.firestore();
      const query = db.collection(this.collection);

      const retrievedData = await query.get();
      const foundItems = retrievedData.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      return foundItems;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteById(id) {
    try {
      const db = admin.firestore();
      const query = db.collection(this.collection);
      const doc = query.doc(id);

      try {
        await doc.delete({ exists: true });
      } catch (err) {
        if (err.code === 5) {
          throw new Error("{error: 'ID no encontrado'}");
        } else {
          throw new Error(err);
        }
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteAll() {
    try {
      const db = admin.firestore();
      const query = db.collection(this.collection);

      await query.delete();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateItem(id, newData) {
    try {
      const db = admin.firestore();
      const query = db.collection(this.collection);
      const doc = query.doc(id);

      const formattedData = this.formatUpdateData(newData);

      await doc.update(formattedData);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default ContainerFirebase;
