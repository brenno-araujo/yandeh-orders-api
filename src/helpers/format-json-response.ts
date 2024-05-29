export const formatJSONResponse = async (statusCode: number, response: any) => {
    return {
      statusCode: statusCode,
      body: JSON.stringify(response),
    };
}