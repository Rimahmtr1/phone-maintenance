    async function checkBalance(userId) {
        try {
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return alert("User data not found.");

            const userData = userSnap.data();
            const balance = userData.balance || 0;

            if (balance < 800000) return alert("You don't have enough balance.");

            const itemData = await getOneAvailableItemCode(userId);
            if (!itemData) return;

            const itemCode = itemData["item-code"];

            // Update balance AFTER item is secured
            const newBalance = balance - 800000;
            await updateDoc(userRef, { balance: newBalance });

            // 🔥 ADDED: Log the transaction
            await logTransaction(userId, itemCode);

            showItemCode(itemCode);

        } catch (error) {
            alert("Error checking balance: " + error.message);
        }
    }

    async function logTransaction(userId, itemCode) {
        try {
            const transactionsRef = collection(db, "transactions");
            const transactionData = {
                date: new Date().toISOString(), // ISO format timestamp
                transactionid: generateTransactionId(),
                type: "item-purchase",
                itemcode: itemCode
            };
            await addDoc(transactionsRef, transactionData);
        } catch (error) {
            console.error("Failed to log transaction:", error.message);
        }
    }

    // 🔧 Utility to generate a simple unique transaction ID (e.g. TX-20250423-XYZ123)
    function generateTransactionId() {
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        return `TX-${datePart}-${randomPart}`;
    }
