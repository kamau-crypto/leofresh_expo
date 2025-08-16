// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import React, { useEffect, useState } from "react";
// import {
// 	Alert,
// 	Button,
// 	FlatList,
// 	StyleSheet,
// 	Text,
// 	TextInput,
// 	View,
// } from "react-native";

// interface FieldMetadata {
// 	fieldname: string;
// 	label: string;
// 	fieldtype: string; // 'Data', 'Select', 'Date', 'Number', 'Link'
// 	required?: boolean;
// 	options?: string; // For 'Select' or 'Link' fields
// 	targetDoctype?: string; // For 'Link' fields
// }

// export interface DocTypeMetadata {
// 	name: string;
// 	fields: FieldMetadata[];
// }

// interface CRUDConfig {
// 	baseURL: string;
// 	token: string; // Add token to the config
// }

// export class DocTypeCRUD {
// 	private metadata: DocTypeMetadata;
// 	private config: CRUDConfig;

// 	constructor(metadata: DocTypeMetadata, config: CRUDConfig) {
// 		this.metadata = metadata;
// 		this.config = config;
// 	}

// 	private async fetchWithToken(url: string, options: RequestInit = {}) {
// 		const headers = {
// 			...options.headers,
// 			"Content-Type": "application/json",
// 			Authorization: `token ${this.config.token}`, // Include the token in the header
// 		};

// 		const response = await fetch(url, {
// 			...options,
// 			headers,
// 		});

// 		if (!response.ok) {
// 			throw new Error(`HTTP error! Status: ${response.status}`);
// 		}

// 		return response.json();
// 	}

// 	private getInputComponent(
// 		field: FieldMetadata,
// 		onChange: (value: any) => void,
// 		value: any
// 	) {
// 		switch (field.fieldtype) {
// 			case "Data":
// 				return (
// 					<TextInput
// 						style={styles.input}
// 						value={value ?? ""}
// 						onChangeText={onChange}
// 						placeholder={field.label}
// 						keyboardType='default'
// 					/>
// 				);
// 			case "Select":
// 				const options = field.options?.split("\n") || [];
// 				return (
// 					<Picker
// 						selectedValue={value ?? ""}
// 						onValueChange={onChange}
// 						style={styles.input}>
// 						<Picker.Item
// 							label={`Select ${field.label}`}
// 							value=''
// 						/>
// 						{options.map(opt => (
// 							<Picker.Item
// 								key={opt}
// 								label={opt}
// 								value={opt}
// 							/>
// 						))}
// 					</Picker>
// 				);
// 			case "Date":
// 				return (
// 					<DateTimePicker
// 						value={value || new Date()}
// 						mode='date'
// 						display='default'
// 						onChange={(event, date) => onChange(date)}
// 					/>
// 				);
// 			case "Number":
// 				return (
// 					<TextInput
// 						style={styles.input}
// 						value={value?.toString()}
// 						onChangeText={text => onChange(parseFloat(text ?? 0))}
// 						placeholder={field.label}
// 						keyboardType='numeric'
// 					/>
// 				);
// 			case "Link":
// 				return (
// 					<LinkInput
// 						targetDoctype={field.targetDoctype!}
// 						value={value}
// 						onChange={onChange}
// 						token={this.config.token} // Pass the token to LinkInput
// 					/>
// 				);
// 			default:
// 				return (
// 					<TextInput
// 						style={styles.input}
// 						value={value ?? ""}
// 						onChangeText={onChange}
// 						placeholder={field.label}
// 					/>
// 				);
// 		}
// 	}

// 	private async handleSubmit(data: any, id?: string) {
// 		try {
// 			const url = id ? `${this.config.baseURL}/${id}` : this.config.baseURL;
// 			const method = id ? "PUT" : "POST";

// 			await this.fetchWithToken(url, {
// 				method,
// 				body: JSON.stringify(data),
// 			});
// 		} catch (error) {
// 			console.error("Submission error:", error);
// 			throw error;
// 		}
// 	}

// 	public getFormComponent(initialData?: any, onSubmit?: () => void) {
// 		return () => {
// 			const [formData, setFormData] = useState(initialData || {});
// 			const [errors, setErrors] = useState<string[]>([]);

// 			const handleFieldChange = (fieldname: string, value: any) => {
// 				setFormData({ ...formData, [fieldname]: value });
// 			};

// 			const validateForm = () => {
// 				const newErrors: string[] = [];
// 				this.metadata.fields.forEach(field => {
// 					if (field.required && !formData[field.fieldname]) {
// 						newErrors.push(`${field.label} is required`);
// 					}
// 				});
// 				setErrors(newErrors);
// 				return newErrors.length === 0;
// 			};

// 			const handleSubmit = async () => {
// 				if (validateForm()) {
// 					try {
// 						await this.handleSubmit(formData, initialData?.name);
// 						Alert.alert("Success", "Data saved successfully!");
// 						onSubmit?.();
// 					} catch (error) {
// 						Alert.alert("Error", "Failed to save data. Please try again.");
// 					}
// 				}
// 			};

// 			return (
// 				<View style={styles.formContainer}>
// 					{errors.length > 0 && (
// 						<View style={styles.errorContainer}>
// 							{errors.map((error, index) => (
// 								<Text
// 									key={index}
// 									style={styles.errorText}>
// 									{error}
// 								</Text>
// 							))}
// 						</View>
// 					)}

// 					{this.metadata.fields.map(field => (
// 						<View
// 							key={field.fieldname}
// 							style={styles.inputContainer}>
// 							<Text style={styles.label}>{field.label}:</Text>
// 							{this.getInputComponent(field, formData[field.fieldname], value =>
// 								handleFieldChange(field.fieldname, value)
// 							)}
// 						</View>
// 					))}

// 					<Button
// 						title={initialData ? "Update" : "Create"}
// 						onPress={handleSubmit}
// 					/>
// 				</View>
// 			);
// 		};
// 	}

// 	public getListComponent() {
// 		return () => {
// 			const [data, setData] = useState<any[]>([]);
// 			const [loading, setLoading] = useState(true);

// 			useEffect(() => {
// 				fetchData();
// 			}, []);

// 			const fetchData = async () => {
// 				try {
// 					console.log("Config = ", this.config);
// 					const result = await this.fetchWithToken(this.config.baseURL);
// 					console.log(result);
// 					setData(result);
// 					setLoading(false);
// 				} catch (error) {
// 					console.error("Fetch error:", error);
// 					setLoading(false);
// 				}
// 			};

// 			const handleDelete = async (id: string) => {
// 				await this.fetchWithToken(`${this.config.baseURL}/${id}`, {
// 					method: "DELETE",
// 				});
// 				fetchData();
// 			};

// 			if (loading) return <Text>Loading...</Text>;
// 			// return <Text>Home Page, Muraya</Text>;

// 			return (
// 				<FlatList
// 					data={data}
// 					keyExtractor={item => item.name}
// 					renderItem={({ item }) => (
// 						<View style={styles.listItem}>
// 							<Text>{item.name}</Text>
// 							<View style={styles.buttonContainer}>
// 								<Button
// 									title='Edit'
// 									onPress={() => {
// 										/* Navigate to edit form */
// 									}}
// 								/>
// 								<Button
// 									title='Delete'
// 									onPress={() => handleDelete(item.name)}
// 								/>
// 							</View>
// 						</View>
// 					)}
// 				/>
// 			);
// 		};
// 	}
// }

// // Link Input Component for Linking to Other Doctypes
// const LinkInput = ({
// 	targetDoctype,
// 	value,
// 	onChange,
// 	token,
// }: {
// 	targetDoctype: string;
// 	value: any;
// 	onChange: (value: any) => void;
// 	token: string;
// }) => {
// 	const [options, setOptions] = useState<any[]>([]);
// 	const [loading, setLoading] = useState(true);

// 	useEffect(() => {
// 		fetch(`https://api.example.com/${targetDoctype}`, {
// 			headers: {
// 				Authorization: `Bearer ${token}`, // Include the token
// 			},
// 		})
// 			.then(response => response.json())
// 			.then(data => {
// 				setOptions(data);
// 				setLoading(false);
// 			})
// 			.catch(error => {
// 				console.error("Fetch error:", error);
// 				setLoading(false);
// 			});
// 	}, [targetDoctype, token]);

// 	if (loading) return <Text>Loading...</Text>;

// 	return (
// 		<Picker
// 			selectedValue={value}
// 			onValueChange={onChange}
// 			style={styles.input}>
// 			<Picker.Item
// 				label={`Select ${targetDoctype}`}
// 				value=''
// 			/>
// 			{options.map(opt => (
// 				<Picker.Item
// 					key={opt.id}
// 					label={opt.name}
// 					value={opt.id}
// 				/>
// 			))}
// 		</Picker>
// 	);
// };

// const styles = StyleSheet.create({
// 	formContainer: {
// 		padding: 20,
// 	},
// 	inputContainer: {
// 		marginBottom: 15,
// 	},
// 	label: {
// 		marginBottom: 5,
// 		fontWeight: "bold",
// 	},
// 	input: {
// 		borderWidth: 1,
// 		borderColor: "#ccc",
// 		padding: 10,
// 		borderRadius: 5,
// 	},
// 	listItem: {
// 		backgroundColor: "#f6f6f6",
// 		flexDirection: "column",
// 		gap: 4,
// 		padding: 15,
// 		borderBottomWidth: 1,
// 		borderBottomColor: "#eee",
// 	},
// 	buttonContainer: {
// 		flexDirection: "row",
// 		gap: 10,
// 	},
// 	errorContainer: {
// 		marginBottom: 15,
// 		backgroundColor: "#ffebee",
// 		padding: 10,
// 		borderRadius: 5,
// 	},
// 	errorText: {
// 		color: "red",
// 	},
// });

// Example usage:
// const customerMetadata: DocTypeMetadata = {
//   name: 'Customer',
//   fields: [
//     { fieldname: 'name', label: 'Name', fieldtype: 'Data', required: true },
//     { fieldname: 'email', label: 'Email', fieldtype: 'Data' },
//     { fieldname: 'status', label: 'Status', fieldtype: 'Select', options: 'Active\nInactive' },
//     { fieldname: 'birthdate', label: 'Birth Date', fieldtype: 'Date' },
//     { fieldname: 'age', label: 'Age', fieldtype: 'Number' },
//     { fieldname: 'linked_doctype', label: 'Linked Doctype', fieldtype: 'Link', targetDoctype: 'OtherDoctype' },
//   ],
// };

// const customerCRUD = new DocTypeCRUD(customerMetadata, {
//   baseURL: 'https://api.example.com/customers',
//   token: 'your-auth-token-here', // Add the token
// });

// const CustomerForm = customerCRUD.getFormComponent();
// const CustomerList = customerCRUD.getListComponent();

/**
 * 
 * 		const customerCRUD = new DocTypeCRUD(customerMetadata, {
		baseURL: `${process.env.EXPO_PUBLIC_FRAPPE_URL}/resource/Customer`,
		token: `${process.env.EXPO_PUBLIC_API_KEY!}:${process.env
			.EXPO_PUBLIC_API_SECRET!}`,
	});

	console.log(activeProject);

	//Authorization: `token ${process.env.EXPO_PUBLIC_API_KEY!}:${process.env
	//.EXPO_PUBLIC_API_SECRET!}`,
	//"Content-Type": "application/json",
	// const customerCRUD = new DocTypeCRUD(customerMetadata, {
	// 	baseURL: `${process.env.EXPO_PUBLIC_FRAPPE_URL}/api/resource/Customer`,
	// });

	// const CustomerForm = customerCRUD.getFormComponent();
	// const CustomerList = customerCRUD.getListComponent();
 * 
 * 
 */
