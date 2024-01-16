import { useState } from "react";
import { useUser } from '../../contexts/UserContext';

const GenerateRoutes = () => {
    const { user } = useUser();
    const [localDate, setLocalDate] = useState(new Date());
    const [generatedRoutes, setGeneratedRoutes] = useState([]);


    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    const handleDateChange = (date) => {
        setLocalDate(date);
    };

    const handleGenerateRoutes = async () => {
        try {
            const formattedDate = formatDate(localDate);

            const response = await fetch(`http://localhost:8080/orders/new-routes/${user.distributionCentre.id}?localDate=${formattedDate}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Generated routes:', data);
                setGeneratedRoutes(data);
                alert("Routes Generated");
            } else {
                console.error('Failed to generate routes:', response.status, response.statusText);
                console.log(user)
                alert("Routes already generated for today")
            }
        } catch (error) {
            console.error('Error generating routes:', error);
        }
    };

    return (
        <>
            <h2>Generate Routes</h2>
            <label>
                Date:
                <input
                    type="date"
                    value={localDate.toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(new Date(e.target.value))} />
            </label>

            <button onClick={handleGenerateRoutes}>Generate Routes</button>

            <ul>
                {generatedRoutes.map((route, index) => (
                    <li key={index}>
                        <p>ID: {route.id}</p>
                        <p>Address: {route.address}</p>
                        <p>Postcode: {route.postcode}</p>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default GenerateRoutes;
