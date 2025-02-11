export async function list(folder = "", usuari, port) {
	try {
		const response = await fetch(`http://localhost:8000/ftp.php?action=list&folder=${folder}&user=${usuari}&port=${port}`);
		const data = await response.json();
		return data;
	} catch (error) {
		return { success: false, message: "Failed to fetch files." };
	}
}

export async function log(usuari = "") {
	return usuari
}

export async function getFileInfo(file, usuari, port) {
	try {
		const response = await fetch(`http://localhost:8000/ftp.php?action=read&user=${usuari}&port=${port}`, {
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

export async function updateFile(fileName, newContent, usuari, port) {
	try {
		const data = {
			file: fileName,
			content: newContent,
		};
		const response = await fetch(`http://localhost:8000/ftp.php?action=update&user=${usuari}&port=${port}`, {
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

export async function deleteFile(fileName, usuari, port) {
	try {
		const data = {
			file: fileName,
		};
		const response = await fetch(`http://localhost:8000/ftp.php?action=delete&user=${usuari}&port=${port}`, {
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

export async function putFile(fileName, fileContent, usuari, port) {
	try {
		const data = {
			file: fileName,
			content: fileContent,
		};
		const response = await fetch(`http://localhost:8000/ftp.php?action=update&user=${usuari}&port=${port}`, {
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
