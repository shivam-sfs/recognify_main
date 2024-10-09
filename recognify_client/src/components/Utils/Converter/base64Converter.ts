const base64Converter = (file: File) => {
    return new Promise<string>((res, rej) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => res(reader.result?.toString() || "")
        reader.onerror = () => rej(reader.error)
    })

}

export default base64Converter