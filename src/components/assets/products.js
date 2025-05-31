import product1 from './asics_gel_nimbus_26.webp';
import product2 from './brooks_ghost_max_2.webp';
import product3 from './hoka_clifton_10.jpg';
import product4 from './iphone_16.jpg';
import product5 from './nintendo_switch_2.jpg';
import product6 from './samsonite_rosaline_backpack.webp';
import product7 from './tumi_montana_backpack.jpeg';

// Format adapted from GreatStack Tutorial
let products = [
    {
        id: 1,
        name: 'Asics Gel Nimbus 26 (Women\'s 7)',
        category: 'shoes',
        description: 'Experience cloud-like comfort with the ASICS Men\'s GEL-NIMBUS™ 26 Running Shoes.',
        image: product1,
        price: 180.0
    },
    {
        id: 2,
        name: 'Brooks Ghost Max 2 (Women\'s 7D)',
        category: 'shoes',
        description: 'Soft, smooth, and protective, the Ghost Max 2 women\'s road-running shoes deliver maximum comfort for running or walking.',
        image: product2,
        price: 190.0
    },
    {
        id: 3,
        name: 'Hoka Clifton 10 (Women\'s 6.5D)',
        category: 'shoes',
        description: 'The women\'s HOKA® Clifton 10 delivers ultra-light cushioning and a smooth ride—perfect for daily running, walking, and all-day support.',
        image: product3,
        price: 180.0
    },
    {
        id: 4,
        name: 'Apple iPhone 16 (128 GB Storage)',
        category: 'electronics',
        description: 'iPhone 16 is built for Apple Intelligence, the personal intelligence system that helps you write, express yourself and get things done effortlessly.',
        image: product4,
        price: 1129.0
    },
    {
        id: 5,
        name: 'Nintendo Switch 2',
        category: 'electronics',
        description: 'Start your next gaming adventure with the Nintendo Switch 2 console—packed with upgrades and fun ways to connect and play together.',
        image: product5,
        price: 629
    },
    {
        id: 6,
        name: 'Samsonite Rosaline Eco Backpack',
        category: 'bags',
        description: 'Rosaline Eco is your everyday business solution, designed with clean and minimalistic look.',
        image: product6,
        price: 185.0
    },
    {
        id: 7,
        name: 'Tumi Montana Backpack',
        category: 'bags',
        description: 'This backpack is exceptionally spacious with a side zip expansion for your extra layers or items you pick up along the way.',
        image: product7,
        price: 715.0
    }
]

export default products;