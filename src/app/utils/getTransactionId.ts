export const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.round(Math.random() * 20000)}`
}