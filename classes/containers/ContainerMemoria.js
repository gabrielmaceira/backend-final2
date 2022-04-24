class ContainerMemoria {
    constructor() {
        this.container = []
        this.counter = 1
    }

    formatData(data) {
        return data;
    }

    formatUpdateData(data) {
        return data
    }

    save(data) {
        try {
            const formattedData = this.formatData(data)
            const newItem = { ...formattedData, id: this.counter }
            this.counter++
            this.container.push(newItem)

            return newItem.id
        }
        catch (err) {
            throw new Error(err.message)
        }
    }

    getById(providedId) {
        const id = Number(providedId)
        if (id < 1 || isNaN(id)) {
            throw new Error("{ error: 'ID no es un numero valido' }")
        }
        else {
            try {
                const foundItem = this.container.find(el => el.id === id)
                if (foundItem !== undefined) {
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
    }

    getAll() {
        return this.container;
    }

    deleteById(providedId) {
        const id = Number(providedId)
        if (isNaN(id)) {
            throw new Error("{ error: 'ID no es un numero valido' }")
        }
        else {
            try {
                this.getById(id)
                this.container = this.container.filter(el => el.id !== id)
            }
            catch (err) {
                throw new Error(err.message)
            }
        }
    }

    deleteAll() {
        this.container = []
    }

    updateItem(providedId, newData) {
        const id = Number(providedId)
        if (isNaN(id)) {
            throw new Error("{ error: 'ID no es un numero valido' }")
        }
        else {
            try {
                const foundProduct = this.getById(id)
                const idx = this.container.indexOf(foundProduct)
                const formattedData = this.formatUpdateData(newData)

                this.container[idx] = { ...foundProduct, ...formattedData }
            }
            catch (err) {
                throw new Error(err.message)
            }
        }
    }
}

export default ContainerMemoria