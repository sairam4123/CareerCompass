export default function round(number: number, precision: number = 1) {
    return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
}