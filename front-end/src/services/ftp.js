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
			body: JSON.stringify({ file: file })
		});

		const data = await response.json();
		return data;
	} catch (error) {
		return { success: false, message: "Failed to fetch file." };
	}
}

