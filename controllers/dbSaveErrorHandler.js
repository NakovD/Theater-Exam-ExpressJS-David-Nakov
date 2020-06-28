const failSavingInDB = (error) => {
    const allErrors = error.message.split(', ');
    let errorMessage;
    if (allErrors.length > 1) {
        errorMessage = 'Invalid info!'
    } else {
        errorMessage = allErrors[0].split(': ')[2];
        if (errorMessage.includes('Path `title` is required.')) {
            errorMessage = 'Title is required!';
        } else if (errorMessage.includes('Path `description` is required.')) {
            errorMessage = 'Description is required!';
        } else if (errorMessage.includes('Path `imageURL` is required.')) {
            errorMessage = 'Image URL is required!';
        }
    }
    return errorMessage;
}                                                               //TO DO: customize error messages


module.exports = failSavingInDB;