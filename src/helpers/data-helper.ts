class DateHelper {
    static calculateDeliveryDate(orderDate: Date): Date {
        const day = orderDate.getDay();
        const hour = orderDate.getHours();

        if (day >= 1 && day <= 3) {
            orderDate.setDate(orderDate.getDate() + 3);
        } else if (day === 4 && hour <= 13) {
            orderDate.setDate(orderDate.getDate() + 4);
        } else {
            orderDate.setDate(orderDate.getDate() + 5);
        }

        return orderDate;
    }
}

export default DateHelper;
