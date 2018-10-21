const bb = () => {
    console.log(444234324234);
    try {
        [].split(',');
    } catch(e) {
        console.log(e);
    }
};
export default {
    bb,
};