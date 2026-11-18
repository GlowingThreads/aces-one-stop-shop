// Photos for each choice of a product option (usually Flavour), hosted on this site under public/import/.
// Use this when a product has more choices than Lightspeed eCom can hold photos for (16 per product), or when
// the photos are not in Lightspeed at all. The product page shows the matching photo when a customer picks a choice,
// and the first photo is used on product cards when the product has no photo in Lightspeed.
//
// Layout: { productId: { "Exact choice name as in Lightspeed": "/import/folder/file.jpg", ... } }
// A choice without an entry here simply keeps the product's other photos.
const flavourPhotos = {
  // Ripper X 2 150K Pods: distributor pack shots. No photo exists yet for S. Blue Razz Catchy Ice, Bubbly Strawberry Watermelon.
  878838144: {
    "Blitz Blue Razz Ice": "/import/ripper-x2/blitz-blue-razz-ice.jpg",
    "Mtn Citrus Raspberry": "/import/ripper-x2/mtn-citrus-raspberry.jpg",
    "Vanilla Banana": "/import/ripper-x2/vanilla-banana.jpg",
    "Mighty Mint": "/import/ripper-x2/mighty-mint.jpg",
    "Pink Bomb Ice": "/import/ripper-x2/pink-bomb-ice.jpg",
    "Hawaiian Red": "/import/ripper-x2/hawaiian-red.jpg",
    "Triple Berry Peach": "/import/ripper-x2/triple-berry-peach.jpg",
    "Blue Raspberry Cherry": "/import/ripper-x2/blue-raspberry-cherry.jpg",
    "Grape Ice": "/import/ripper-x2/grape-ice.jpg",
    "Pineapple Coconut": "/import/ripper-x2/pineapple-coconut.jpg",
    "Hyper Ice": "/import/ripper-x2/hyper-ice.jpg",
    "Vanilla Iced Coffee": "/import/ripper-x2/vanilla-iced-coffee.jpg",
    "Classico Cherry Ice": "/import/ripper-x2/classico-cherry-ice.jpg",
    "Watermelon Peach": "/import/ripper-x2/watermelon-peach.jpg",
    "S. Berries": "/import/ripper-x2/s-berries.jpg",
    "Watermelon Strawberry Kiwi Ice": "/import/ripper-x2/watermelon-strawberry-kiwi-ice.jpg",
    "R.B": "/import/ripper-x2/r-b.jpg",
    "Honeydew Pineapple": "/import/ripper-x2/honeydew-pineapple.jpg",
    "Strawberry Raspberry Blueberry Ice": "/import/ripper-x2/strawberry-raspberry-blueberry-ice.jpg",
    "Blood Orange Ice": "/import/ripper-x2/blood-orange-ice.jpg",
    "Fruit Ranger": "/import/ripper-x2/fruit-ranger.jpg",
    "D. P Cherry": "/import/ripper-x2/d-p-cherry.jpg",
    "Blueberry Ice": "/import/ripper-x2/blueberry-ice.jpg",
    "Peach Raspberry": "/import/ripper-x2/peach-raspberry.jpg",
    "Strawberry Banana": "/import/ripper-x2/strawberry-banana.jpg",
    "Spearmint Ice": "/import/ripper-x2/spearmint-ice.jpg",
    "Peach Ice": "/import/ripper-x2/peach-ice.jpg",
    "Banana Raspberry Ice": "/import/ripper-x2/banana-raspberry-ice.jpg",
    "S. Burst": "/import/ripper-x2/s-burst.jpg",
    "Strawberry Cherry Watermelon": "/import/ripper-x2/strawberry-cherry-watermelon.jpg",
    "Swedish": "/import/ripper-x2/swedish.jpg",
    "Mango Peach": "/import/ripper-x2/mango-peach.jpg",
    "S. Catchy Ice": "/import/ripper-x2/s-catchy-ice.jpg",
    "Rainbow": "/import/ripper-x2/rainbow.jpg",
    "Dragon Fruit Lychee": "/import/ripper-x2/dragon-fruit-lychee.jpg",
    "Banana": "/import/ripper-x2/banana.jpg",
    "Epic Fruit Bomb": "/import/ripper-x2/epic-fruit-bomb.jpg",
    "White Peach": "/import/ripper-x2/white-peach.jpg",
    "Peachy Fuz": "/import/ripper-x2/peachy-fuz.jpg",
    "Classico Ice": "/import/ripper-x2/classico-ice.jpg",
    "Orange Fizz": "/import/ripper-x2/orange-fizz.jpg",
    "SKT Wild Berry": "/import/ripper-x2/skt-wild-berry.jpg",
    "White Grape Ice": "/import/ripper-x2/white-grape-ice.jpg",
    "Citrus Berry Punch": "/import/ripper-x2/citrus-berry-punch.jpg",
    "Strawberry": "/import/ripper-x2/strawberry.jpg",
    "Grape Citrus Green Apple Ice": "/import/ripper-x2/grape-citrus-green-apple-ice.jpg",
    "Hi-Mango Pineapple": "/import/ripper-x2/hi-mango-pineapple.jpg",
    "C. Macchiato": "/import/ripper-x2/c-macchiato.jpg",
  },
};

export default flavourPhotos;
