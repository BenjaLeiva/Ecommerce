// Base de datos local simulada para el prototipo
const productsData = [
    {
        id: 1,
        title: "Chainsaw Man Vol. 15",
        editorial: "Ivrea Argentina",
        country: "Argentina",
        price: 9500,
        type: "reserva", // 'stock' o 'reserva'
        estimatedArrival: "3 a 4 semanas",
        image: "https://cdnx.jumpseller.com/shazam-online/image/41870091/chainsaw_man_15_ivrea.jpg?1699466531",
        stockCount: 0
    },
    {
        id: 2,
        title: "Jujutsu Kaisen Vol. 22",
        editorial: "Norma Editorial",
        country: "España",
        price: 12500,
        type: "stock",
        estimatedArrival: "Inmediata",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcT8BPmFBMMJ_wxI04SgyqSBf_0PIJLvXQTFBnjt13tg22qzNusA48VWnZ&s=10",
        stockCount: 4
    },
    {
        id: 3,
        title: "Berserk Edición Deluxe Vol. 1",
        editorial: "Panini",
        country: "México",
        price: 24900,
        type: "reserva",
        estimatedArrival: "2 semanas",
        image: "https://kodoku.cl/cdn/shop/files/sbelu001_1200x1200.jpg?v=1784919900",
        stockCount: 0
    },
    {
        id: 4,
        title: "Spy x Family Vol. 11",
        editorial: "Ivrea Argentina",
        country: "Argentina",
        price: 9500,
        type: "stock",
        estimatedArrival: "Inmediata",
        image: "https://http2.mlstatic.com/D_NQ_NP_677741-MLA99568263126_122025-O.webp",
        stockCount: 8
    },
    {
        id: 5,
        title: "Guardianes del Sur - Galvarino",
        editorial: "Planeta",
        country: "Chile",
        price: 8000,
        type: "stock",
        estimatedArrival: "Inmediata",
        image: "https://guardianesdelsur.cl/wp-content/uploads/2024/02/galva-500x703-1.jpg",
        stockCount: 15
    }
];