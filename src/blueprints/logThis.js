export default function logThis(text) {
    return (req, _res, next) => {
        try {
            console.log(text);
            next();
        } catch (e) {
            next(e);
        }
    };
}