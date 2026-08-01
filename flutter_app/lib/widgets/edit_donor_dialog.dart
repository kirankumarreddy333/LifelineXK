import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/donor.dart';
import 'custom_text_field.dart';
import 'primary_button.dart';

class EditDonorDialog extends StatefulWidget {
  final Donor donor;
  final Function(Donor) onSave;

  const EditDonorDialog({
    super.key,
    required this.donor,
    required this.onSave,
  });

  @override
  State<EditDonorDialog> createState() => _EditDonorDialogState();
}

class _EditDonorDialogState extends State<EditDonorDialog> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _ageController;
  late TextEditingController _phoneController;
  late TextEditingController _cityController;
  late String _selectedBloodGroup;
  late DateTime _selectedDate;
  late bool _isAvailable;

  final List<String> _bloodGroups = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.donor.fullName);
    _ageController = TextEditingController(text: widget.donor.age.toString());
    _phoneController = TextEditingController(text: widget.donor.phone);
    _cityController = TextEditingController(text: widget.donor.city);
    _selectedBloodGroup = widget.donor.bloodGroup;
    _selectedDate = widget.donor.lastDonationDate;
    _isAvailable = widget.donor.isAvailable;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: const ColorScheme.light(
              primary: Color(0xFFDC2626),
              onPrimary: Colors.white,
              onSurface: Color(0xFF111827),
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  void _submit() {
    if (_formKey.currentState!.validate()) {
      final updated = widget.donor.copyWith(
        fullName: _nameController.text.trim(),
        bloodGroup: _selectedBloodGroup,
        age: int.parse(_ageController.text.trim()),
        phone: _phoneController.text.trim(),
        city: _cityController.text.trim(),
        lastDonationDate: _selectedDate,
        isAvailable: _isAvailable,
      );
      widget.onSave(updated);
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryRed = Color(0xFFDC2626);
    const darkText = Color(0xFF111827);

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Container(
        maxWidth: 500,
        padding: const EdgeInsets.all(24),
        child: SingleChildScrollView(
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Edit Donor Details',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: primaryRed,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: darkText),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
                const Divider(height: 20),
                CustomTextField(
                  label: 'Full Name',
                  controller: _nameController,
                  prefixIcon: Icons.person,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'Name is required' : null,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Blood Group',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: darkText,
                  ),
                ),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  value: _selectedBloodGroup,
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: Colors.white,
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 14,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFFDDDDDD)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFFDDDDDD)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: primaryRed, width: 2),
                    ),
                  ),
                  items: _bloodGroups.map((group) {
                    return DropdownMenuItem(
                      value: group,
                      child: Text(group),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedBloodGroup = val);
                  },
                ),
                const SizedBox(height: 8),
                CustomTextField(
                  label: 'Age',
                  controller: _ageController,
                  keyboardType: TextInputType.number,
                  prefixIcon: Icons.cake,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Age is required';
                    final age = int.tryParse(v.trim());
                    if (age == null || age < 18 || age > 70) {
                      return 'Enter age between 18 and 70';
                    }
                    return null;
                  },
                ),
                CustomTextField(
                  label: 'Phone Number',
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  prefixIcon: Icons.phone,
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) return 'Phone is required';
                    if (v.trim().length < 10) return 'Enter valid phone number';
                    return null;
                  },
                ),
                CustomTextField(
                  label: 'City',
                  controller: _cityController,
                  prefixIcon: Icons.location_city,
                  validator: (v) =>
                      (v == null || v.trim().isEmpty) ? 'City is required' : null,
                ),
                const SizedBox(height: 8),
                InkWell(
                  onTap: _pickDate,
                  child: InputDecorator(
                    decoration: InputDecoration(
                      labelText: 'Last Donation Date',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      prefixIcon: const Icon(Icons.calendar_today, color: primaryRed),
                    ),
                    child: Text(
                      DateFormat('yyyy-MM-dd').format(_selectedDate),
                      style: const TextStyle(fontSize: 16, color: darkText),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Text(
                      'Availability Status:',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: darkText,
                      ),
                    ),
                    const Spacer(),
                    Switch.adaptive(
                      value: _isAvailable,
                      activeColor: primaryRed,
                      onChanged: (val) => setState(() => _isAvailable = val),
                    ),
                    Text(_isAvailable ? 'Available' : 'Unavailable'),
                  ],
                ),
                const SizedBox(height: 16),
                PrimaryButton(
                  text: 'Save Changes',
                  onPressed: _submit,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
