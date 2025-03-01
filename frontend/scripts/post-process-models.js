module.exports = {
    postProcessModels(models) {
        return models.map(model => {
            if (model.name === 'Folder') {
                model.properties.id = {
                    type: 'string',
                    description: 'MongoDB ObjectId as string'
                };
            }
            return model;
        });
    }
};