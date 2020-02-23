'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Order = require('src/model/Order');

var _Order2 = _interopRequireDefault(_Order);

var _OrderProduct = require('src/model/OrderProduct');

var _OrderProduct2 = _interopRequireDefault(_OrderProduct);

var _mongoose = require('mongoose');

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _excel4node = require('excel4node');

var _excel4node2 = _interopRequireDefault(_excel4node);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var borderLeft = { // §18.8.4 border (Border)
  right: {
    style: 'thin',
    color: '#000000'
  }
};

var borderTop = { // §18.8.4 border (Border)
  top: {
    style: 'thin',
    color: '#000000'
  }
};

var bordergray = { // §18.8.4 border (Border)
  left: {
    style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
    color: '#b3b3b3' // HTML style hex value
  },
  right: {
    style: 'thin',
    color: '#b3b3b3'
  },
  top: {
    style: 'thin',
    color: '#b3b3b3'
  },
  bottom: {
    style: 'thin',
    color: '#b3b3b3'
  }
};

var borderblack = { // §18.8.4 border (Border)
  left: {
    style: 'thin', //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
    color: '#000000' // HTML style hex value
  },
  right: {
    style: 'thin',
    color: '#000000'
  },
  top: {
    style: 'thin',
    color: '#000000'
  },
  bottom: {
    style: 'thin',
    color: '#000000'
  }
};

var Order = function () {
  function Order() {
    _classCallCheck(this, Order);

    // create reusable transporter object using the default SMTP transport
    this.transporter = _nodemailer2.default.createTransport({
      service: 'gmail',
      auth: {
        user: 't3textilesmailer@gmail.com',
        pass: 't3textilesmailer12345'
      }
    });
  }

  _createClass(Order, [{
    key: 'getOrders',
    value: function getOrders(params) {
      var page = params.page || 1;
      delete params.page;
      var limit = 20;

      if (params.search) {
        params.$or = [{
          orderNumber: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          email: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          nit: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          city: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          businessName: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }, {
          sellerName: {
            $regex: ".*" + params.search + ".*",
            $options: 'i'
          }
        }];
        if (_mongoose.Types.ObjectId.isValid(params.search)) {
          params.$or.push({
            _id: params.search
          });
        }
        delete params.search;
      }

      params['deleted'] = 0;

      return _Order2.default.paginate(params, { page: page, limit: limit, sort: { 'createdAt': -1 } }).then(function (response) {
        return Promise.resolve(response);
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'generateOrderNumber',
    value: function generateOrderNumber(lastOrder) {
      var lastNumber = lastOrder ? parseInt(lastOrder.orderNumber) : 0;
      // let newNumberTemp = (lastNumber + 1) + '';
      var newNumber = lastNumber + 1 + '';
      // let newNumber = newNumberTemp.length < 4 ?
      //   (newNumberTemp.length == 1 ?
      //     '000' + newNumberTemp :
      //       (newNumberTemp.length == 2 ?
      //          '00' + newNumberTemp : '0' + newNumberTemp))
      //   : newNumberTemp;
      return newNumber;
    }
  }, {
    key: 'getOrderProducts',
    value: function getOrderProducts(id, query) {
      query['order'] = id;
      return _OrderProduct2.default.find(query).exec().then(function (docs) {
        return Promise.resolve(docs);
      }).catch(function (err) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'addProductsToOrder',
    value: function addProductsToOrder(id, params) {
      var _this = this;

      var orderProductArray = JSON.parse(params.colors);
      return _OrderProduct2.default.deleteMany({ order: id, ref: params.refId }).exec().then(function (deleted) {
        return _OrderProduct2.default.insertMany(orderProductArray).then(function (products) {
          var orderId = new _mongoose.Types.ObjectId(id);
          return _OrderProduct2.default.aggregate([{
            $facet: {
              "totalPrice": [{ $match: { order: orderId } }, {
                $group: {
                  _id: '$order',
                  totalCOP: { $sum: '$totalPrice' },
                  totalMeters: { $sum: '$meters' }
                }
              }],
              "totalRefs": [{ $match: { order: orderId } }, {
                $group: {
                  _id: '$ref'
                }
              }, {
                $group: {
                  _id: 1,
                  count: {
                    $sum: 1
                  }
                }
              }]
            }
          }]).exec().then(function (docs) {
            var newOrderData = {
              totalRefs: 0,
              totalMeters: 0,
              totalCOP: 0
            };
            if (docs.length > 0 && docs[0].totalPrice.length > 0) {
              var data = docs[0];
              var totalPrice = data.totalPrice[0];
              var totalRefs = data.totalRefs[0];
              newOrderData = {
                totalRefs: totalRefs.count,
                totalMeters: totalPrice.totalMeters,
                totalCOP: totalPrice.totalCOP
              };
            }
            _this.updateOrder(orderId, newOrderData);
            return Promise.resolve(products);
          }).catch(function (err) {
            return Promise.reject(e);
          });
        }).catch(function (e) {
          return Promise.reject(e);
        });
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'addOrderByEmail',
    value: function addOrderByEmail(orderData) {
      var _this2 = this;

      return _Order2.default.findOne({}, {}, { sort: { 'createdAt': -1 } }).exec().then(function (lastOrder) {
        var newOrder = new _Order2.default();
        newOrder.orderNumber = _this2.generateOrderNumber(lastOrder);
        newOrder.businessName = orderData['businessName'];
        newOrder.nit = orderData['nit'];
        newOrder.billingAddress = orderData['billingAddress'];
        newOrder.city = orderData['city'];
        newOrder.phone = orderData['phone'];
        newOrder.email = orderData['email'];
        newOrder.billingEmail = '';
        newOrder.shippingAddress = orderData['shippingAddress'];
        newOrder.shippingCity = orderData['shippingCity'];
        newOrder.terms = '';
        newOrder.observations = '';
        newOrder.totalRefs = 0;
        newOrder.totalMeters = 0;
        newOrder.totalCOP = 0;
        newOrder.finalized = 0;
        newOrder.sellerName = orderData['sellerName'];
        newOrder.sellerEmail = orderData['sellerEmail'];
        newOrder.clientCode = orderData['clientCode'];
        newOrder.client = new _mongoose.Types.ObjectId(orderData.clientId);
        newOrder.seller = new _mongoose.Types.ObjectId(orderData.sellerId);

        return newOrder.save().then(function (order) {
          return Promise.resolve({ order: order });
        }).catch(function (e) {
          return Promise.reject(e);
        });
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'updateOrder',
    value: function updateOrder(id, newData) {
      var _this3 = this;

      if (newData.clientId) {
        newData.client = new _mongoose.Types.ObjectId(newData.clientId);
      }

      if (newData.dispatchDate) {
        newData.dispatchDate = new Date(parseInt(newData['dispatchDate']));
      }

      return _Order2.default.findByIdAndUpdate(id, { $set: newData }, { safe: true, upsert: true, new: true }).exec().then(function (order) {
        // se encontró el usuario
        if (order) {
          if (newData.finalized) {
            _OrderProduct2.default.aggregate([{ $match: { order: order._id } }, { $group: {
                _id: '$refName',
                totalCOP: { $sum: '$totalPrice' },
                totalMeters: { $sum: '$meters' }
              } }]).exec().then(function (refMeters) {
              var query = {
                order: order._id
              };
              _OrderProduct2.default.find(query).exec().then(function (orderProducts) {
                var _loop = function _loop(index) {
                  var refIndex = refMeters.findIndex(function (ref) {
                    return ref._id === orderProducts[index].refName;
                  });
                  if (!('products' in refMeters[refIndex])) {
                    refMeters[refIndex]['products'] = [];
                  }
                  refMeters[refIndex]['products'].push(orderProducts[index]);
                };

                for (var index in orderProducts) {
                  _loop(index);
                }
                _this3.createExcel(order, refMeters);
              });
            });
          }
          return Promise.resolve({ order: order });
        } else {
          return Promise.reject({ status: _g.constants.ERROR_CODES.HTTP_STATUS.NOT_FOUND });
        }
      }).catch(function (e) {
        return Promise.reject(e);
      });
    }
  }, {
    key: 'getPriceMask',
    value: function getPriceMask(inputValue) {
      inputValue = inputValue.toString();
      var arrayDecimal = inputValue.split('.');
      inputValue = arrayDecimal[0];
      inputValue = inputValue.replace(/[^\d]+/g, '');
      inputValue = inputValue.replace(/\./g, '');
      inputValue = inputValue.replace(/´/g, "");
      var invoiceValue = parseFloat(inputValue);
      var thousand = invoiceValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      if (arrayDecimal.length > 1 && arrayDecimal[1]) {
        thousand = thousand + ',' + arrayDecimal[1];
      }
      return thousand;
    }
  }, {
    key: 'createExcel',
    value: function createExcel(order, refMeters) {
      var _this4 = this;

      var wb = new _excel4node2.default.Workbook();
      var ws = wb.addWorksheet('Sheet 1', {
        'sheetView': {
          'showGridLines': false
        }
      });
      ws.addImage({
        path: __dirname + '/../../../../resource/logo.png',
        type: 'picture',
        position: {
          type: 'twoCellAnchor',
          from: {
            col: 1,
            colOff: 0,
            row: 1,
            rowOff: 0
          },
          to: {
            col: 5,
            colOff: 0,
            row: 5,
            rowOff: 0
          }
        }
      });
      ws.row(1).setHeight(15);
      ws.row(2).setHeight(15);
      ws.row(3).setHeight(15);
      ws.row(4).setHeight(15);
      ws.row(5).setHeight(15);

      var headerBackgorund = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: '000000' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#ffffff',
          bold: true,
          size: 13
        },
        alignment: {
          wrapText: true,
          vertical: 'center'
        }
      });

      var headerBackgorundCenter = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: '000000' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#ffffff',
          bold: true,
          size: 13
        },
        alignment: {
          wrapText: true,
          vertical: 'center',
          horizontal: 'center'
        }
      });

      var headerBackgorundGrayCenter = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: 'e6e6e6' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#000000',
          bold: true,
          size: 13
        },
        alignment: {
          wrapText: true,
          vertical: 'center',
          horizontal: 'center'
        }
      });

      var totalText = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: 'ffffff' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#000000',
          bold: true,
          size: 13
        },
        border: borderTop,
        alignment: {
          wrapText: true,
          vertical: 'center',
          horizontal: 'center'
        }
      });

      var refGray = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: 'e6e6e6' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#000000',
          size: 15
        },
        border: borderLeft,
        alignment: {
          wrapText: true,
          vertical: 'center'
        }
      });

      var refwhite = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: 'ffffff' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#000000',
          size: 15
        },
        border: borderLeft,
        alignment: {
          wrapText: true,
          vertical: 'center'
        }
      });

      var refGrayCenter = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: 'e6e6e6' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#000000',
          size: 15
        },
        border: borderLeft,
        alignment: {
          wrapText: true,
          vertical: 'center',
          horizontal: 'center'
        }
      });

      var refwhiteCenter = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: 'ffffff' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#000000',
          size: 15
        },
        border: borderLeft,
        alignment: {
          wrapText: true,
          vertical: 'center',
          horizontal: 'center'

        }
      });

      var whiteCenter = wb.createStyle({
        fill: { // §18.8.20 fill (Fill)
          type: 'pattern', // the only one implemented so far.
          patternType: 'solid', // most common.
          fgColor: 'ffffff' // HTML style hex value. defaults to black
        },
        font: {
          name: 'Arial',
          color: '#000000',
          size: 11
        },
        alignment: {
          wrapText: true,
          vertical: 'center',
          horizontal: 'center'

        }
      });

      var headerTitle = wb.createStyle({
        font: {
          name: 'Arial',
          color: '#000000',
          bold: true,
          size: 13
        },
        alignment: {
          wrapText: true,
          vertical: 'center'
        }
      });

      var headerOrderNumber = wb.createStyle({
        font: {
          name: 'Arial',
          color: '#000000',
          bold: true,
          size: 24
        },
        alignment: {
          wrapText: true,
          vertical: 'center'
        }
      });

      var headerInfo = wb.createStyle({
        font: {
          name: 'Arial',
          color: '#000000',
          size: 13
        },
        alignment: {
          wrapText: true,
          vertical: 'center'
        }
      });

      var clientInfo = wb.createStyle({
        font: {
          name: 'Arial',
          color: '#000000',
          size: 13
        },
        border: bordergray,
        alignment: {
          wrapText: true,
          vertical: 'center'
        }
      });

      var observationsInfo = wb.createStyle({
        font: {
          name: 'Arial',
          color: '#000000',
          size: 13
        },
        border: borderblack,
        alignment: {
          wrapText: true,
          vertical: 'top'
        }
      });
      // header background
      ws.cell(1, 1, 4, 15, true).string('').style(headerBackgorund);

      // header title
      ws.cell(6, 1, 6, 2, true).string('Fecha Pedido').style(headerTitle);
      ws.cell(7, 1, 7, 2, true).string('ID Cliente').style(headerTitle);
      ws.cell(8, 1, 8, 2, true).string('Vendedor').style(headerTitle);
      ws.cell(9, 1, 9, 2, true).string('Orden de compra').style(headerTitle);

      // order number title
      ws.cell(7, 11, 8, 15, true).string('PEDIDO #' + order.orderNumber).style(headerOrderNumber);

      //header info
      ws.cell(6, 4, 6, 6, true).string((0, _moment2.default)(order.createdAt).format('MMMM Do, YYYY')).style(headerInfo);
      ws.cell(7, 4, 7, 6, true).string(order.clientCode + '').style(headerInfo);
      ws.cell(8, 4, 8, 6, true).string(order.sellerName).style(headerInfo);
      ws.cell(9, 4, 9, 6, true).string(order.orderNumber + '').style(headerInfo);

      //header client info section
      ws.cell(11, 1, 11, 15, true).string('Información del Cliente').style(headerBackgorund);

      //client info title
      ws.cell(13, 1, 13, 2, true).string('Cliente').style(headerTitle);
      ws.cell(14, 1, 14, 2, true).string('NIT').style(headerTitle);
      ws.cell(15, 1, 15, 2, true).string('Dirección Facturación').style(headerTitle);
      ws.cell(16, 1, 16, 2, true).string('Ciudad').style(headerTitle);
      ws.cell(17, 1, 17, 2, true).string('Telefono').style(headerTitle);
      ws.cell(18, 1, 18, 2, true).string('Email').style(headerTitle);

      //client info
      ws.cell(13, 4, 13, 7, true).string(order.businessName).style(clientInfo);
      ws.cell(14, 4, 14, 7, true).string(order.nit).style(clientInfo);
      ws.cell(15, 4, 15, 7, true).string(order.billingAddress).style(clientInfo);
      ws.cell(16, 4, 16, 7, true).string(order.city).style(clientInfo);
      ws.cell(17, 4, 17, 7, true).string(order.phone).style(clientInfo);
      ws.cell(18, 4, 18, 7, true).string(order.billingEmail).style(clientInfo);

      //client info title
      ws.cell(13, 9, 13, 10, true).string('Dirección de Envió').style(headerTitle);
      ws.cell(14, 9, 14, 10, true).string('Ciudad').style(headerTitle);
      ws.cell(15, 9, 15, 10, true).string('Condiciones').style(headerTitle);
      ws.cell(16, 9, 16, 10, true).string('Fecha de Entrega').style(headerTitle);

      //client info
      ws.cell(13, 11, 13, 15, true).string(order.shippingAddress).style(clientInfo);
      ws.cell(14, 11, 14, 15, true).string(order.shippingCity).style(clientInfo);
      ws.cell(15, 11, 15, 15, true).string(order.terms).style(clientInfo);
      ws.cell(16, 11, 16, 15, true).string((0, _moment2.default)(order.dispatchDate).format('MMMM Do, YYYY')).style(clientInfo);

      //header refs section
      ws.cell(20, 1, 20, 1, true).string('TOT. MTS').style(headerBackgorund);
      ws.column(1).setWidth(15);
      ws.column(2).setWidth(15);
      ws.cell(20, 2, 20, 2, true).string('REF').style(headerBackgorund);
      ws.cell(20, 3, 20, 9, true).string('COLOR').style(headerBackgorund);
      ws.cell(20, 10, 20, 11, true).string('METROS').style(headerBackgorund);
      ws.cell(20, 12, 20, 13, true).string('PRECIO UNITARIO').style(headerBackgorund);
      ws.cell(20, 14, 20, 15, true).string('TOTAL').style(headerBackgorund);

      // ref section items
      var indexProductSum = 1;
      for (var index in refMeters) {
        var refMetersSumIndex = 20 + indexProductSum;
        ws.cell(refMetersSumIndex, 1, refMetersSumIndex, 1, true).string(refMeters[index].totalMeters + '').style(refMetersSumIndex % 2 == 0 ? refGrayCenter : refwhiteCenter);
        ws.cell(refMetersSumIndex, 2, refMetersSumIndex, 2, true).string(refMeters[index]._id).style(refMetersSumIndex % 2 == 0 ? refGrayCenter : refwhiteCenter);
        var totalRefPrice = '$' + this.getPriceMask(refMeters[index].totalCOP) + '';
        // ws.cell(refMetersSumIndex, 14, refMetersSumIndex, 15, true).string(totalRefPrice).style(refMetersSumIndex % 2 == 0 ? refGrayCenter : refwhiteCenter);

        for (var productIndex in refMeters[index].products) {
          var sumIndex = 20 + indexProductSum;
          ws.row(sumIndex).setHeight(30);
          if (productIndex != 0) {
            ws.cell(sumIndex, 1, sumIndex, 1, true).string('').style(sumIndex % 2 == 0 ? refGray : refwhite);
            ws.cell(sumIndex, 2, sumIndex, 2, true).string('').style(sumIndex % 2 == 0 ? refGray : refwhite);
            // ws.cell(sumIndex, 14, sumIndex, 15, true).string('').style(sumIndex % 2 == 0 ? refGray : refwhite);
          }
          var product = refMeters[index].products[productIndex];
          ws.cell(sumIndex, 3, sumIndex, 9, true).string(product.colorNumber + ' ' + product.colorName).style(sumIndex % 2 == 0 ? refGray : refwhite);
          ws.cell(sumIndex, 10, sumIndex, 11, true).string(product.meters + '').style(sumIndex % 2 == 0 ? refGrayCenter : refwhiteCenter);
          var refPrice = product.msvc === 1 ? 'MVSP' : '$' + this.getPriceMask(product.price) + '';
          var totalPrice = product.msvc === 1 ? 'MVSP' : '$' + this.getPriceMask(product.totalPrice) + '';
          ws.cell(sumIndex, 12, sumIndex, 13, true).string(refPrice).style(sumIndex % 2 == 0 ? refGrayCenter : refwhiteCenter);
          ws.cell(sumIndex, 14, sumIndex, 15, true).string(totalPrice).style(sumIndex % 2 == 0 ? refGrayCenter : refwhiteCenter);
          indexProductSum++;
        }
      }

      // total section

      var subtotalOrder = '$' + this.getPriceMask(order.totalCOP);
      var taxes = order.totalCOP * 0.19;
      var taxesOrder = '$' + this.getPriceMask(taxes);
      var totalWTaxes = taxes + order.totalCOP;
      var totalOrder = '$' + this.getPriceMask(totalWTaxes);
      ws.row(20 + indexProductSum).setHeight(30);
      ws.cell(20 + indexProductSum, 1, 20 + indexProductSum, 11, true).string('').style(totalText);
      ws.cell(20 + indexProductSum, 12, 20 + indexProductSum, 13, true).string('SUBTOTAL').style(totalText);
      ws.cell(20 + indexProductSum, 14, 20 + indexProductSum, 15, true).string(subtotalOrder).style(headerBackgorundCenter);
      indexProductSum++;
      ws.row(20 + indexProductSum).setHeight(30);
      ws.cell(20 + indexProductSum, 1, 20 + indexProductSum, 11, true).string('').style(totalText);
      ws.cell(20 + indexProductSum, 12, 20 + indexProductSum, 13, true).string('IVA 19%').style(totalText);
      ws.cell(20 + indexProductSum, 14, 20 + indexProductSum, 15, true).string(taxesOrder).style(headerBackgorundGrayCenter);
      indexProductSum++;
      ws.row(20 + indexProductSum).setHeight(30);
      ws.cell(20 + indexProductSum, 1, 20 + indexProductSum, 11, true).string('').style(totalText);
      ws.cell(20 + indexProductSum, 12, 20 + indexProductSum, 13, true).string('TOTAL').style(totalText);
      ws.cell(20 + indexProductSum, 14, 20 + indexProductSum, 15, true).string(totalOrder).style(headerBackgorundCenter);

      // observations section header
      ws.cell(20 + (indexProductSum + 2), 1, 20 + (indexProductSum + 2), 15, true).string('Observaciones').style(headerBackgorund);

      // observations info
      ws.cell(20 + (indexProductSum + 3), 1, 20 + (indexProductSum + 6), 15, true).string(order.observations).style(observationsInfo);

      // company info
      ws.cell(20 + (indexProductSum + 8), 1, 20 + (indexProductSum + 8), 15, true).string('Calle 80 Via Parque La Florida Km 1.1 Terrapuerto Industrial El Dorado Bodega 30').style(whiteCenter);
      ws.cell(20 + (indexProductSum + 9), 1, 20 + (indexProductSum + 9), 15, true).string('Cota, Cundinamarca').style(whiteCenter);
      ws.cell(20 + (indexProductSum + 10), 1, 20 + (indexProductSum + 10), 15, true).string('PBX: 508 22 20 - Email: cliente@T3textiles.com.co - www.t3textiles.co').style(whiteCenter);

      wb.write(__dirname + ('/../../../../excel/t3_order_' + order.orderNumber + '.xlsx'), function (err, stats) {
        _this4.sendOrderEmail(order);
      });
    }
  }, {
    key: 'sendOrderEmail',
    value: function sendOrderEmail(order, cb) {
      // setup email data with unicode symbols
      var mailOptions = {
        from: '"T3 textiles" <t3textilesmailer@gmail.com>', // sender address
        // to: `${order.email}, ${order.sellerEmail}`, // list of receivers
        to: order.email + ', ' + order.sellerEmail + ', cliente@t3textiles.com.co, coordinadoradmin@t3textiles.com.co, direccionadmon@t3textiles.com.co, tesoreria@t3textiles.com.co, victorial@t3textiles.com.co', // list of receivers
        subject: 'T3 textiles Orden ' + order.orderNumber, // Subject line
        text: order.businessName + ', gracias por preferirnos.\n\nSu orden ha sido recibida exitosamente, nuestro equipo de servicio al cliente iniciar\xE1 el proceso de revisi\xF3n y despacho.\n\nA continuaci\xF3n encontrar\xE1 adjunto la orden. Por favor validar que toda la informancion est\xE9 correcta. Si tiene alguna duda, cambio o inconsistencia por favor comun\xEDquese con nuestro equipo de servicio al cliente al 318 5864340 o 318 5698645.', // plain text body
        html: order.businessName + ', gracias por preferirnos<br/><br/>\n      Su orden ha sido recibida exitosamente, nuestro equipo de servicio al cliente iniciar\xE1 el proceso de revisi\xF3n y despacho.<br/><br/>\n      A continuaci\xF3n encontrar\xE1 adjunto la orden. Por favor validar que toda la informancion est\xE9 correcta. Si tiene alguna duda, cambio o inconsistencia por favor comun\xEDquese con nuestro equipo de servicio al cliente al 318 5864340 o 318 5698645.<br/><br/>', // html body
        attachments: [{ // filename and content type is derived from path
          path: __dirname + '/../../../../excel/t3_order_' + order.orderNumber + '.xlsx'
        }]
      };

      // send mail with defined transport object
      this.transporter.sendMail(mailOptions, function (error, info) {});
    }
  }]);

  return Order;
}();

exports.default = Order;