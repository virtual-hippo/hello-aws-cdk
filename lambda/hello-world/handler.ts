export const handler = async function (event: any, context: any) {
    return {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({ message: 'Hello World!' })
    };
};