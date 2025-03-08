export class FileUploadService {
    private serverUrl: string;

    constructor(serverUrl: string) {
        this.serverUrl = serverUrl;
    }

    async uploadFile(file: File, filename: string): Promise<{ filename: string; url: string }> {
        const formData = new FormData();
        formData.append("file", file, filename);

        try {
            const response = await fetch(`${this.serverUrl}/upload`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error uploading file: ${await response.text()}`);
            }

            return await response.json(); // Expect JSON { filename, url }
        } catch (error) {
            console.error("File upload error:", error);
            throw error;
        }
    }

    async getFileList(): Promise<string[]> {
        try {
            const response = await fetch(`${this.serverUrl}/files`);
            if (!response.ok) {
                throw new Error(`Error fetching files: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching files:", error);
            throw error;
        }
    }

    async deleteFile(filename: string): Promise<void> {
        try {
            const response = await fetch(`${this.serverUrl}/files/${filename}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Error deleting file: ${response.statusText}`);
            }
        } catch (error) {
            console.error("Error deleting file:", error);
            throw error;
        }
    }
}
