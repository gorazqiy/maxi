const { Sequelize } = require("sequelize");
const bcrypt = require("bcryptjs");

const sequelize = new Sequelize(
   "postgres://postgres:postgres@localhost:5432/maxi",
   {
      dialect: "postgres",
      logging: false,
   },
);

async function seed() {
   try {
      await sequelize.authenticate();
      console.log("✅ Подключено к БД");

      // 1. Создаём админа
      const hash = await bcrypt.hash("admin123", 10);
      await sequelize.query(`
         INSERT INTO users (name, email, password_hash, phone, address, role, created_at, updated_at)
         VALUES ('Админ', 'admin@shop.ru', '${hash}', '', '', 'admin', NOW(), NOW())
         ON CONFLICT (email) DO NOTHING;
      `);
      console.log("✅ Админ создан: admin@shop.ru / admin123");

      // 2. Создаём товар
      const product = await sequelize.query(`
         INSERT INTO products (name, description, composition, price, category_id, created_at, updated_at)
         VALUES ('Платье летнее', 'Красивое летнее платье из натурального хлопка', '100% хлопок', 3500, 1, NOW(), NOW())
         RETURNING id;
      `);
      const productId = product[0][0].id;
      console.log(`✅ Товар создан, id = ${productId}`);

      // 3. Добавляем изображение товара
      await sequelize.query(`
         INSERT INTO product_images (product_id, image_url, sort_order)
         VALUES (${productId}, 'https://via.placeholder.com/600x800/FFB6C1/333333?text=Платье+летнее', 0);
      `);
      console.log("✅ Изображение товара добавлено");

      console.log("\n🎉 Готово! Товар с изображением в базе.");
   } catch (err) {
      console.error("❌ Ошибка:", err);
   } finally {
      await sequelize.close();
   }
}

seed();
