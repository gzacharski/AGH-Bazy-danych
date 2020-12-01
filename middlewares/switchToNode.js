module.exports.select = (request, response, next) => {

    let label = request.path.split('/')[2];
    label = mapPathToNode(label);

    request.headers['node_label'] = label;
    next();
}

const mapPathToNode = (label) => {

    switch (label) {
        case 'customers':
            label = 'Customer';
            break;
        case 'suppliers':
            label = 'Supplier';
            break;
        case 'products':
            label = 'Product';
            break;
        case 'shippers':
            label = 'Shipper';
            break;
        case 'orders':
            label = 'Order';
            break;
        case 'employees':
            label = 'Employee';
            break;
        case 'categories':
            label = 'Category';
            break;
        default:
            label = null;
    }

    return label;
}