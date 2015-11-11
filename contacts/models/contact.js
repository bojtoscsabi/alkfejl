module.exports = {
    identity: 'contact',
    connection: 'default',
    attributes: {
        name: {
            type: 'string',
            required: true,
        },
        phonenumber: {
            type: 'string',
            required: true,
        },
        email: {
            type: 'string',
            required: true,
        },
        address: {
            type: 'string',
            required: true,
        },
        category: {
            type: 'string',
            enum: ['Összes', 'Család', 'Barátok', 'Kollégák'],
            required: true,
        },
        
        user: {
            model: 'user',
        },
    }
}