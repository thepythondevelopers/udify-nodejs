module.exports = (sequelize, Sequelize) => {
    const StripeSubscription = sequelize.define("stripe_subscriptions", {
      guid : {
        type: Sequelize.CHAR(32),
        primaryKey: true,
      },
      subscription_id: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      object: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      application_fee_percent :{
        type: Sequelize.STRING,
      },
      created:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      billing_cycle_anchor:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      current_period_end:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      current_period_start:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      billing_thresholds: {
        type: Sequelize.STRING(),
      },
      cancel_at: {
        type: Sequelize.STRING,
      },
      cancel_at_period_end :{
        allowNull: false,
        type: Sequelize.STRING,
      },
      canceled_at:{
        type: Sequelize.STRING,
      },

      collection_method: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      public_id: {
        type: Sequelize.CHAR(32),
        allowNull: false,
      },
      plan_id: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      customer_stripe_id: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(),
        allowNull: false,
      },
      check_status:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      latest_invoice_payment_intent_status: {
        type: Sequelize.STRING(),
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
      
    },{
      timestamps: false
  });
    return StripeSubscription;
  };