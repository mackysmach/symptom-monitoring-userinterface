export const getallpet = async (user_id) => {
    try {

        const config = {
            method: "GET"
        };
        const res = await fetch(` http://localhost:8080/pet/all/${user_id}`, config);
        const data = await res.json();
        //console.log(data)
        return data;
    } catch (err) {
        console.log(err);
    }
}