import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.usuario.create({
        data: {
            nome: 'admin',
            cargo: "admin",
            user: 'admin',
            senha: '$2b$10$8eJHFxsyn9uqk4AfIa3Ls.ShUzSXWQ4vzSyOPJ3EiZPOcAMUc7bhG',
            isAdmin: true
        }
    })
    await prisma.produto.createMany({
        data: [
            { nome: 'Salgado Clássico', descricao: 'Coxinha de frango e catupiry, esfirra de carne, esfirra de frango, americano salsicha, americano salsicha e bacon, americano presunto e queijo, pastelão de carne, disco de carne', preco: 10.00 },
            { nome: 'Pão de Queijo', descricao: 'Sanduíche de pão de queijo tradicional', preco: 4.00 },
            { nome: 'Omelete Simples', descricao: '3 ovos, muçarela', preco: 18.00 },
            { nome: 'Omelete Especial', descricao: '3 ovos, muçarela, presunto e tomate', preco: 25.00 },
            { nome: 'Misto Quente', descricao: 'Presunto, queijo e tomate', preco: 16.00 },
            { nome: 'Porção de Frutas', descricao: 'Banana com canela, mamão, manga, melancia', preco: 12.90 },
            { nome: 'Leite com Achocolatado', descricao: 'Bebida quente', preco: 8.00 },
            { nome: 'Café', descricao: 'Bebida quente tradicional', preco: 3.00 },

            // Lanches
            { nome: 'Hamb X-Burguer', descricao: 'Pão, carne e queijo', preco: 21.00 },
            { nome: 'Hamb X-Salada Simples', descricao: 'Pão, carne, queijo, alface e tomate', preco: 26.00 },
            { nome: 'Hamb X-Salada Especial', descricao: 'Pão, carne, queijo, ovo, milho, batata, alface e tomate', preco: 32.90 },
            { nome: 'Hamb X-Salada Bacon', descricao: 'Pão, carne, queijo, bacon, milho, batata, alface e tomate', preco: 32.90 },
            { nome: 'Hamb X-Salada Tudo', descricao: 'Pão, carne, queijo, ovo, salsicha, presunto, bacon, batata, milho, alface e tomate', preco: 37.90 },
            

            { nome: 'Frango X-Burguer', descricao: 'Pão, carne e queijo', preco: 22.90 },
            { nome: 'Frango X-Salada Simples', descricao: 'Pão, carne, queijo, alface e tomate', preco: 27.90 },
            { nome: 'Frango X-Salada Especial', descricao: 'Pão, carne, queijo, ovo, milho, batata, alface e tomate', preco: 34.90 },
            { nome: 'Frango X-Salada Bacon', descricao: 'Pão, carne, queijo, bacon, milho, batata, alface e tomate', preco: 34.90 },
            { nome: 'Frango X-Salada Tudo', descricao: 'Pão, carne, queijo, ovo, salsicha, presunto, bacon, batata, milho, alface e tomate', preco: 39.90 },

            { nome: 'Lombo X-Burguer', descricao: 'Pão, carne e queijo', preco: 23.90 },
            { nome: 'Lombo X-Salada Simples', descricao: 'Pão, carne, queijo, alface e tomate', preco: 28.90 },
            { nome: 'Lombo X-Salada Especial', descricao: 'Pão, carne, queijo, ovo, milho, batata, alface e tomate', preco: 36.90 },
            { nome: 'Lombo X-Salada Bacon', descricao: 'Pão, carne, queijo, bacon, milho, batata, alface e tomate', preco: 36.90 },
            { nome: 'Lombo X-Salada Tudo', descricao: 'Pão, carne, queijo, ovo, salsicha, presunto, bacon, batata, milho, alface e tomate', preco: 39.90 },

            { nome: 'Filé X-Burguer', descricao: 'Pão, carne e queijo', preco: 25.90 },
            { nome: 'Filé X-Salada Simples', descricao: 'Pão, carne, queijo, alface e tomate', preco: 31.90 },
            { nome: 'Filé X-Salada Especial', descricao: 'Pão, carne, queijo, ovo, milho, batata, alface e tomate', preco: 39.90 },
            { nome: 'Filé X-Salada Bacon', descricao: 'Pão, carne, queijo, bacon, milho, batata, alface e tomate', preco: 39.90 },
            { nome: 'Filé X-Salada Tudo', descricao: 'Pão, carne, queijo, ovo, salsicha, presunto, bacon, batata, milho, alface e tomate', preco: 42.90 },




            { nome: 'Empadão Goiano', descricao: 'Palmito ou guariroba', preco: 28.00 },
            { nome: 'Salada Simples', descricao: 'Alface, tomate cereja, cenoura ralada, azeitona e cebola roxa', preco: 34.90 },

            // Petiscos
            { nome: 'Batata Frita', descricao: 'Porção 600g', preco: 32.00 },
            { nome: 'Filé de Tilápia', descricao: 'Porção 600g', preco: 64.90 },
            { nome: 'Filé de Frango na Chapa', descricao: 'Acompanha muçarela, tomate e mandioca (600g)', preco: 74.90 },
            { nome: 'Contra Filé Acebolado na Chapa', descricao: 'Acompanha muçarela, tomate, cebola e mandioca (500g)', preco: 94.00 },
            { nome: 'Filé na Chapa', descricao: 'Acompanha muçarela, tomate, cebola e mandioca (400g)', preco: 119.90 },
            { nome: 'Camafeu de Camarão', descricao: '7 unidades (400g)', preco: 59.90 },
            { nome: 'Bolinho de Costela', descricao: 'Recheado com queijo (10 unidades)', preco: 39.90 },
            { nome: 'Bolinho de Mandioca', descricao: 'Recheado com carne seca (10 unidades)', preco: 34.90 },
            { nome: 'Disquinho de Costela', descricao: 'Recheado com bacon e cheddar (10 unidades)', preco: 35.90 },
            { nome: 'Disquinho de Carne com Queijo', descricao: '10 unidades', preco: 35.90 },
            { nome: 'Porção de Quibe', descricao: 'Recheado com requeijão (10 unidades)', preco: 32.90 },
            { nome: 'Iscas de Frango Empanado', descricao: 'Porção 450g', preco: 32.90 },
            { nome: 'Panceta Rústica', descricao: 'Porção 450g', preco: 39.90 },
            { nome: 'Frango a Passarinho', descricao: 'Coxa e sobrecoxa (1kg)', preco: 35.90 },
            { nome: 'Dadinho de Tapioca', descricao: 'Recheado com queijo coalho (350g)', preco: 35.90 },
            { nome: 'Disquinho de Abóbora Kabutiá', descricao: 'Recheado com carne seca (10 unidades)', preco: 34.90 },

            // Long Necks
            { nome: 'Corona Long Neck', descricao: 'Cerveja 330ml', preco: 10.00 },
            { nome: 'Heineken Long Neck', descricao: 'Cerveja 330ml', preco: 10.00 },
            { nome: 'Budweiser Long Neck', descricao: 'Cerveja 330ml', preco: 10.00 },
            { nome: 'Spaten Long Neck', descricao: 'Cerveja 330ml', preco: 10.00 },
            { nome: 'Eisenbahn Long Neck', descricao: 'Cerveja 330ml', preco: 10.00 },
            { nome: 'Stella Long Neck', descricao: 'Cerveja 330ml', preco: 10.00 },
            { nome: 'Sol Long Neck', descricao: 'Cerveja 330ml', preco: 10.00 },
            { nome: 'Petra Long Neck', descricao: 'Cerveja 330ml', preco: 10.00 },

            // Cervejas 600ml
            { nome: 'Amstel 600ml', descricao: 'Cerveja garrafa', preco: 16.90 },
            { nome: 'Heineken 600ml', descricao: 'Cerveja garrafa', preco: 14.90 },
            { nome: 'Original 600ml', descricao: 'Cerveja garrafa', preco: 12.00 },

            // Cervejas Lata
            { nome: 'Corona Lata', descricao: 'Cerveja 350ml', preco: 8.00 },
            { nome: 'Heineken Lata', descricao: 'Cerveja 350ml', preco: 8.00 },
            { nome: 'Budweiser Lata', descricao: 'Cerveja 350ml', preco: 8.00 },
            { nome: 'Spaten Lata', descricao: 'Cerveja 350ml', preco: 8.00 },
            { nome: 'Original Lata', descricao: 'Cerveja 350ml', preco: 8.00 },
            { nome: 'Amstel Lata', descricao: 'Cerveja 350ml', preco: 8.00 },
            { nome: 'Petra Lata', descricao: 'Cerveja 350ml', preco: 8.00 },

            // Bebidas
            { nome: 'Coca-Cola 600ml', descricao: 'Refrigerante', preco: 9.00 },
            { nome: 'Coca-Cola Zero 600ml', descricao: 'Refrigerante', preco: 9.00 },
            { nome: 'Guaraná Antártica 600ml', descricao: 'Refrigerante', preco: 9.00 },
            { nome: 'Fanta 600ml', descricao: 'Refrigerante', preco: 9.00 },
            { nome: 'Soda 600ml', descricao: 'Refrigerante', preco: 9.00 },
            { nome: 'Gatorade 600ml', descricao: 'Bebida isotônica', preco: 10.50 },
            { nome: 'Coca-Cola Lata', descricao: 'Refrigerante 350ml', preco: 6.00 },
            { nome: 'Coca-Cola Zero Lata', descricao: 'Refrigerante 350ml', preco: 6.00 },
            { nome: 'Guaraná Antártica Lata', descricao: 'Refrigerante 350ml', preco: 6.00 },
            { nome: 'Fanta Lata', descricao: 'Refrigerante 350ml', preco: 6.00 },
            { nome: 'Água com Gás 500ml', descricao: 'Água mineral gaseificada', preco: 6.00 },
            { nome: 'Água sem Gás 500ml', descricao: 'Água mineral natural', preco: 4.00 },
            { nome: 'H2O 500ml', descricao: 'Bebida saborizada', preco: 9.00 },
            { nome: 'Água de Coco 200ml', descricao: 'Natural', preco: 5.00 },
            { nome: 'Achocolatado 200ml', descricao: 'Bebida láctea', preco: 4.50 },

            // Sucos
            { nome: 'Suco da Polpa', descricao: 'Acerola, maracujá, morango, abacaxi, abacaxi c/ hortelã, goiaba, manga, cupuaçu, tamarindo, açaí, uva, graviola, cajá, caju', preco: 12.00 },
            { nome: 'Suco La Fruit 200ml', descricao: 'Uva, maracujá, caju, goiaba, pêssego, manga', preco: 5.00 },
            { nome: 'Suco La Fruit 1L', descricao: 'Uva, maracujá, caju, goiaba, pêssego, manga', preco: 12.00 },
            { nome: 'Suco Del Valle 450ml', descricao: 'Laranja ou uva', preco: 8.00 },
            
        ]
    })

}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
