import mongoose from 'mongoose'
import productModel from '../../models/productModel.js'

class ContainerMongoDB {
    constructor() {
        this.database = 'ecommerce'
        this.connectionString = `mongodb+srv://${process.env.NODE_MONGO_USER}:${process.env.NODE_MONGO_PASS}@gabocluster.apupl.mongodb.net/${this.database}?retryWrites=true&w=majority`
        this.model = productModel
    }

    formatData(data) {
        return data;
    }

    formatUpdateData(data) {
        return data
    }

    async save(data) {
        try {
            const URL = this.connectionString
            mongoose.connect(URL,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })

            const formattedData = this.formatData(data)
            const dataSaveModel = new this.model(formattedData)
            const savedData = await dataSaveModel.save()

            mongoose.disconnect()

            return savedData._id
        }
        catch (err) {
            throw new Error(err.message)
        }
    }

    async getById(id) {
        try {
            const URL = this.connectionString
            mongoose.connect(URL,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })

            const objId = mongoose.mongo.ObjectId(id)
            const foundItem = await this.model.findOne({ _id: objId })

            mongoose.disconnect()

            if (foundItem?._id !== undefined) {
                return foundItem
            }
            else {
                throw new Error("{error: 'ID no encontrado'}")
            }
        }
        catch (err) {
            throw new Error(err.message)
        }
    }

    async getAll() {
        try {
            const URL = this.connectionString
            mongoose.connect(URL,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })

            const foundItems = await this.model.find({})

            mongoose.disconnect()

            return foundItems
        }
        catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteById(id) {
        try {
            const URL = this.connectionString
            mongoose.connect(URL,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })

            const objId = mongoose.mongo.ObjectId(id)
            const deletedData = await this.model.deleteOne({ _id: objId })

            mongoose.disconnect()

            if (deletedData.deletedCount === 0) {
                throw new Error("{error: 'ID no encontrado'}")
            }
        }
        catch (err) {
            throw new Error(err.message)
        }
    }

    async deleteAll() {
        try {
            const URL = this.connectionString
            mongoose.connect(URL,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })

            await this.model.deleteMany({})

            mongoose.disconnect()
        }
        catch (err) {
            throw new Error(err.message)
        }
    }

    async updateItem(id, newData) {
        try {
            const URL = this.connectionString
            mongoose.connect(URL,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })

            const objId = mongoose.mongo.ObjectId(id)
            const formattedData = this.formatUpdateData(newData)

            await this.model.updateOne({ _id: objId }, { $set: formattedData })

            mongoose.disconnect()
        }
        catch (err) {
            throw new Error(err.message)
        }
    }
}

export default ContainerMongoDB