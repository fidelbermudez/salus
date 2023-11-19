import React, { useContext, useState } from 'react'

const BudgetsContext = React.createContext()

export function useBudgets() {
    return useContext(BudgetsContext)

}

export const BudgetsProvider = ({ children }) => {
    const [budgets, setBudgets] = useState([]) //Might need to change here for hook that is use localstorage

    function addBudget(name, max) { //check later so it fits with my schema, the id part has to fit with the id in the schema
        setBudgets(prevBudgets => {
            if (prevBudgets.find(budget => budget.name === name)) {
                return prevBudgets
            }
            return [...prevBudgets, {name, max}] //check later so it fits with my schema, the id part has to fit with the id in the schema
        })

    }

    function deleteBudget({ id }) {
        //TODO deal with uncatrogized budgets
        setBudgets(prevBudgets => {
            return prevBudgets.filter(budget => budget.id !== id)  //check this later so it matches with my schema
        })

    }

    return <BudgetsContext.Provider value={{
        budgets,
        addBudget,
        deleteBudget
    }}>{children}</BudgetsContext.Provider>
}