import { test, expect } from '@playwright/test';

// Configuración: se ejecuta antes de cada prueba
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
});

test.describe('Pruebas en SauceDemo - Login', () => {
  
  // PRUEBA POSITIVA 1: Login correcto
  test('Login exitoso con credenciales validas', async ({ page }) => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Verificamos que el login fue exitoso
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    console.log('✓ Login exitoso: Usuario navego a la pagina de productos');
  });

  // PRUEBA POSITIVA 2: Agregar producto al carrito
  test('Agregar producto al carrito', async ({ page }) => {
    // Login primero
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Agregar producto
    await page.locator('#add-to-cart-sauce-labs-backpack').click();

    // Verificar que el carrito muestra "1"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    console.log('✓ Producto agregado: Carrito muestra 1 item');
  });

  // PRUEBA POSITIVA 3: Logout exitoso
  test('Logout exitoso', async ({ page }) => {
    // Login
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Abrir menu y hacer logout
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();

    // Verificar que volvimos al login
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    console.log('✓ Logout exitoso: Sesion cerrada correctamente');
  });

  // PRUEBA NEGATIVA 1: Login con credenciales incorrectas
  test('Login fallido con credenciales incorrectas', async ({ page }) => {
    await page.locator('#user-name').fill('usuario_inexistente');
    await page.locator('#password').fill('contrasena_incorrecta');
    await page.locator('#login-button').click();

    // Verificar mensaje de error
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );

    console.log('✓ Error manejado: Sistema muestra mensaje apropiado');
  });

  // PRUEBA NEGATIVA 2: Usuario bloqueado
  test('Usuario bloqueado no puede acceder', async ({ page }) => {
    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    // Verificar mensaje de usuario bloqueado
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Sorry, this user has been locked out'
    );

    console.log('✓ Bloqueo manejado: Usuario bloqueado no puede acceder');
  });

  // PRUEBA NEGATIVA 3: Formulario vacio
  test('Error al enviar formulario vacio', async ({ page }) => {
    // No llenamos ningun campo
    await page.locator('#login-button').click();

    // Verificar mensaje de error
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username is required'
    );

    console.log('✓ Validacion activa: Sistema pide datos obligatorios');
  });
});

// Configuración global para hacer pruebas más robustas
test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  // Esperar a que la página cargue completamente
  await page.waitForLoadState('networkidle');
});

