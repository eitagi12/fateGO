// export const PRODUCT_TYPE = 'GADGET/IOT';
export const PRODUCT_TYPE = 'PREMIUM';
export const PRODUCT_SUB_TYPE = 'N/A';
export const SUB_STOCK_DESTINATION = 'BRN';

export const DATA_models_of_product: object = {
    'resultCode': '20000',
    'resultDescription': 'Success',
    'developerMessage': 'Success',
    'data': {
      'statusCode': '20000',
      'statusDesc': 'success',
      'offset': 1,
      'maxRow': 10,
      'totalRow': '5',
      'countRow': '5',
      'products': [
        {
          'brand': 'AUNJAI',
          'name': 'Aunjai SuperMan',
          'model': 'Aunjai SuperMan',
          'imageUrl': 'https://privilege.ais.co.th/PrivImages/26092019_115603_cb007a.jpg',
          'itemType': 'NORMAL',
          'dv': [],
          'productType': 'PREMIUM',
          'productSubtype': 'N/A',
          'normalPrice': {
            'min': '17900',
            'max': '18900'
          },
          'promotionPrice': {},
          'subProducts': [
            {
              'name': 'Aunjai SuperMan Aluminum 40mm',
              'model': 'W4ALUMINUM40',
              'imageUrl': 'https://privilege.ais.co.th/PrivImages/28062019_183213_5d2bf8.jpg',
              'normalPrice': {
                'min': '17900',
                'max': '17900'
              },
              'promotionPrice': {}
            },
            {
              'name': 'Aunjai SuperMan Aluminum 44mm',
              'model': 'W4ALUMINUM44',
              'imageUrl': 'https://privilege.ais.co.th/PrivImages/28062019_183213_5d2bf8.jpg',
              'normalPrice': {
                'min': '18900',
                'max': '18900'
              },
              'promotionPrice': {}
            }
          ]
        },
        {
          'brand': 'AUNJAI',
          'name': 'Aunjai Watch4 Nike',
          'model': 'Aunjai Watch4 Nike',
          'imageUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSME2c1ly-adWQKD7ILUPhr57SrvVP2JZmd7RjYBvwqNYfjRLgw4A&s',
          'itemType': 'NORMAL',
          'dv': [],
          'productType': 'PREMIUM',
          'productSubtype': 'N/A',
          'normalPrice': {
            'min': '17900',
            'max': '18900'
          },
          'promotionPrice': {},
          'subProducts': [
            {
              'name': 'Aunjai Watch4 Nike 40mm',
              'model': 'W4NIKE40',
              'imageUrl': 'N/A',
              'normalPrice': {
                'min': '17900',
                'max': '17900'
              },
              'promotionPrice': {}
            },
            {
              'name': 'Aunjai Watch4 Nike 44mm',
              'model': 'W4NIKE44',
              'imageUrl': 'N/A',
              'normalPrice': {
                'min': '18900',
                'max': '18900'
              },
              'promotionPrice': {}
            }
          ]
        }
      ]
    }
  };

export const DATA_brands_of_product: object = {
    'resultCode': '20000',
    'resultDescription': 'Success',
    'developerMessage': 'Success',
    'data': [
        {
            'name': 'AUNJAI',
            // tslint:disable-next-line: max-line-length
            'imageUrl': 'https://www.flashfly.net/wp/wp-content/uploads/2019/10/191017-Pic-01-การรวมตัวกันครั้งแรกของ-น้องมะม่วง-x-อุ่นใจ-ไอเทมพรีเมี่ยม....jpg',
            'priority': '0'
        },
        {
            'name': 'APPLE',
            // tslint:disable-next-line: max-line-length
            'imageUrl': 'https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-11-pro-select-2019-family?wid=882&amp;hei=1058&amp;fmt=jpeg&amp;qlt=80&amp;op_usm=0.5,0.5&amp;.v=1567812930312',
            'priority': '9999'
        }
    ]
};
