export async function list() {
	try {
		const response = await fetch("http://localhost:8000/ftp.php?action=list");
		const data = await response.json();
		return data;
	} catch (error) {
		return { success: false, message: "Failed to fetch files." };
	}
}

export async function getFileInfo(file) {
	try {
		const response = await fetch("http://localhost:8000/ftp.php?action=read", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ file: file }),
		});
		const data = await response.json();
		return data;
	} catch (error) {
		return { success: false, message: "Failed to fetch file." };
	}
}

export async function updateFile(fileName, newContent) {
	try {
		const data = {
			file: fileName,
			content: newContent,
		};
		const response = await fetch("http://localhost:8000/ftp.php?action=update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const result = await response.json();
		if (result.success) {
			return { success: true, message: "File updated successfully." };
		}
	} catch (error) {
		return { success: false, message: "Error updating the file." };
	}
}

export async function deleteFile(fileName) {
	try {
		const data = {
			file: fileName,
		};
		const response = await fetch("http://localhost:8000/ftp.php?action=delete", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const result = await response.json();
		if (result.success) {
			return { success: true, message: "File deleted successfully." };
		}
	} catch (error) {
		return { success: false, message: "Error deleting the file." };
	}
}

export async function putFile(fileName, fileContent) {
	try {
		const data = {
			file: fileName,
			content: fileContent,
		};
		const response = await fetch("http://localhost:8000/ftp.php?action=update", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const result = await response.json();
		if (result.success) {
			return { success: true, message: "File uploaded successfully." };
		}
	} catch (error) {
		return { success: false, message: "Error uploading the file." };
	}
}

