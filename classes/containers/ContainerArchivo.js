import * as fs from 'fs'

class ContainerArchivo {

    constructor(fileName) {
        this.fileName = fileName;
    }

    formatData(data) {
        return data;
    }

    formatUpdateData(data) {
        return data
    }

    async save(data) {
        let initialData = [];

        try {
            const fileData = await fs.promises.readFile(this.fileName, 'utf-8')
            try {
                initialData = JSON.parse(fileData)
            }
            catch (err) {
                console.log(err)
                console.log("The file has incorrect data - starting over")
                try {
                    await fs.promises.writeFile(`${this.fileName}.bak`, fileData)
                    console.log("Backup file saved")
                }
                catch (err) {
                    throw new Error(err)
                }
            }
        }
        catch (err) {
            throw new Error(err)
        }

        try {
            const id = initialData.length === 0 ? 1 : initialData[initialData.length - 1].id + 1

            const formattedData = this.formatData(data)
            initialData.push({ id, ...formattedData })

            await fs.promises.writeFile(this.fileName, JSON.stringify(initialData))

            return id;
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async getById(providedId) {
        try {
            const fileData = await fs.promises.readFile(this.fileName, 'utf-8')
            const parsedData = JSON.parse(fileData)

            const foundItem = parsedData.find(item => item.id === Number(providedId))

            if (foundItem) {
                return foundItem
            }
            else {
                throw new Error("El id no existe")
            }
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async getAll() {
        try {
            const fileData = await fs.promises.readFile(this.fileName, 'utf-8')
            const parsedData = JSON.parse(fileData)

            return parsedData
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async deleteById(providedId) {
        try {
            const fileData = await fs.promises.readFile(this.fileName, 'utf-8')
            const parsedData = JSON.parse(fileData)

            const filteredData = parsedData.filter(item => item.id !== Number(providedId))

            if (filteredData.length === parsedData.length) {
                throw new Error("El id no existe")
            }
            else {
                await fs.promises.writeFile(this.fileName, JSON.stringify(filteredData))
            }
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async deleteAll() {
        try {
            await fs.promises.writeFile(this.fileName, "[]")
        }
        catch (err) {
            throw new Error(err)
        }
    }

    async updateItem(id, newData) {
        try {
            const allItems = await this.getAll()
            let itemPosition = allItems.findIndex(item => item.id === Number(id))

            if (itemPosition < 0) {
                throw new Error("El id ingresado no existe")
            }
            else {
                allItems[itemPosition] = { ...allItems[itemPosition], ...newData }
                await fs.promises.writeFile(this.fileName, JSON.stringify(allItems))
            }
        }
        catch (err) {
            throw new Error(err)
        }
    }

}

export default ContainerArchivo