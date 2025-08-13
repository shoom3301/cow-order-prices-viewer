import './App.css'
import { Header } from "./components/Header";
import { OrderIdInput } from "./components/OrderIdInput";
import { OrderView } from "./components/OrderView";

export function App() {
    return (
        <div className="app-container">
            <Header/>
            <OrderIdInput/>
            <OrderView/>
        </div>
    )
}
