module.exports.select = (request, response, next) => {

    console.log(request.path);

    let label = request.path.split('/')[2];
    label=mapPathToNode(label);
    
    request.headers['node_label']= label;
    next();
}

const mapPathToNode = (label) => {

    switch (label) {
        case 'suppliers':
            label='Supplier';
            break;
        case 'products':
            label='Product';
            break;
        default:
            console.log(`There is no such a expression.`);
    }

    return label;
}