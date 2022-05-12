import { useState } from "react";

const SearchGroup = () => {
    // Send a request to the backend to search for the required group with the criterias

    const [language, setLanguage] = useState()
    const [subject, setSubject] = useState();
    const [size, setSize] = useState();
    const [gradeGoal, setGradeGoal] = useState();
    const [frequency, setFrequency] = useState();
    const [workMethod, setWorkMethod] = useState();

    async function searchForGroup(){
        const data = await fetch('/api/v1/groups/search?' + new URLSearchParams({subject, size, gradeGoal, frequency, workMethod, language}));

        const yes = await data.json()
        console.log(yes)
        // This is where to start

    }

    return <div>
        <input type="text"/>
        <div><h2>Søk etter gruppekriterier</h2>
        <h4>Velg kriterier for søket</h4>
            <div>
                <div>
                    <select name="språk" onChange={(e) => setLanguage(e.target.value)}>
                        <option value="Norsk">Norsk</option>
                        <option value="Engelsk">Engelsk</option>
                    </select>
                </div>
                <div>
                    <select name="emne" onChange={(e) => setSubject(e.target.value)}>
                        <option value="Programmering">Programmering</option>
                        <option value="Frontend">Frontend</option>
                        <option value="InteraktivtDesign">InteraktivtDesign</option>
                    </select>
                </div>
                <div>
                    <select name="størrelse" onChange={(e) => setSize(e.target.value)}>
                        <option value="liten">Liten (1-4stk)</option>
                        <option value="Medium">Liten (5-7stk)</option>
                        <option value="Stor">Stor (8+)</option>
                    </select>
                </div>
            </div>
            <div>
                <select name="karaktermål" onChange={(e) => setGradeGoal(e.target.value)}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                </select>
            </div>
            <div>
                <select name="arbeidsfrekvens" onChange={(e) => setFrequency(e.target.value)}>
                    <option value="Månedlig">Månedlig</option>
                    <option value="Ukentlig">Ukentlig</option>
                </select>
            </div>
            <div>
                <input type="radio" name={"metode"} id={"fysisk"} value={"fysisk"} onChange={(e) => setWorkMethod(e.target.value)}/>
                <label htmlFor="fysisk">Fysisk</label>
                <input type="radio" name={"metode"} id={"digitalt"} value={"digitalt"} onChange={(e) => setWorkMethod(e.target.value)}/>
                <label htmlFor="digitalt">Digitalt</label>
                <input type="radio" name={"metode"} id={"begge"} value={"begge"} onChange={(e) => setWorkMethod(e.target.value)}/>
                <label htmlFor="begge">Begge</label>
            </div>
        </div>
    </div>;
}

export default SearchGroup;