const { z } = require('zod');

// Skema validasi untuk register user
const registerUserSchema = z.object({
  body: z.object({
    name: z.string({
        required_error: 'Nama tidak boleh kosong'
    }).min(3, 'Nama minimal 3 karakter'),

    email: z.string({
        required_error: 'Email tidak boleh kosong'
    }).email('Format email tidak valid'),

    password: z.string({
        required_error: 'Password tidak boleh kosong'
    }).min(6, 'Password minimal 6 karakter'),

    number: z.string().optional(), // Menjadikan nomor telepon opsional
  }),
});

// Skema validasi untuk login user
const loginUserSchema = z.object({
  body: z.object({
    email: z.string({
        required_error: 'Email tidak boleh kosong'
    }).email('Format email tidak valid'),
    
    password: z.string({
        required_error: 'Password tidak boleh kosong'
    }),
  }),
});

// PENTING: Pastikan Anda mengekspor skema ini
module.exports = {
    registerUserSchema,
    loginUserSchema,
};