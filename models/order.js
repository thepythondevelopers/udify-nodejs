module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define("orders", {
        guid : {
        type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      store_id: {
        allowNull: false,
        type: Sequelize.CHAR(32),
        allowNull: false,
      },     
      created_at :{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      subtotal: {
        allowNull: false,
        type: Sequelize.STRING(45)
      },
      subtotal: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      total: {
        allowNull: false,
        type: Sequelize.STRING(20),
      },
      closed_at: {
        type: Sequelize.DATE
      },
      shopify_order_id: {
        allowNull: false,
        type: Sequelize.STRING(30)
      },
      note: {
        type: Sequelize.STRING()
     },
     token: {
        type: Sequelize.STRING(45)
    },
    gateway: {
        type: Sequelize.STRING(45)
    },
    total_weight: {
        type: Sequelize.INTEGER()  
    },
    total_tax: {
        type: Sequelize.STRING(45)
    },
    taxes_included: {
        type: Sequelize.BOOLEAN()
    },
    currency: {
        type: Sequelize.STRING(3)
    },
    financial_status: {
        type: Sequelize.STRING(45)
    },
    confirmed: {
        type: Sequelize.BOOLEAN()
    },
    total_discounts: {
        type: Sequelize.STRING(45)
    },
    total_line_items_price: {
        type: Sequelize.STRING(45)
    },
    cart_token: {
        type: Sequelize.STRING(45)
    },
    name: {
        type: Sequelize.STRING(45)
    },
    cancelled_at: {
        type: Sequelize.DATE
    },
    cancel_reason: {
        type: Sequelize.STRING()
    },
    total_price_usd: {
        type: Sequelize.STRING(45)
    },
    checkout_token: {
        type: Sequelize.STRING(45)
    },
    processed_at: {
        type: Sequelize.DATE
    },
    device_id: {
        type: Sequelize.STRING(45)
    },
    app_id: {
        type: Sequelize.INTEGER()  
    },
    browser_ip: {
        type: Sequelize.STRING(60)
    },
    fulfillment_status: {
        type: Sequelize.STRING(45)
    },
    order_status_url: {
        type: Sequelize.STRING()
    },
    customer_id: {
        type: Sequelize.STRING(30)
    },
    variant_ids: {
        type: Sequelize.STRING(500)
    },
    product_ids: {
        type: Sequelize.STRING(500)
    },
    sys_updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')    
    }

    },{
      timestamps: false
  });
    return Order;
  };