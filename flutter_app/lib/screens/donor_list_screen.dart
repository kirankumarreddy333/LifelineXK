import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../models/donor.dart';
import '../providers/donor_provider.dart';
import '../widgets/donor_card.dart';
import '../widgets/edit_donor_dialog.dart';

class DonorListScreen extends StatefulWidget {
  const DonorListScreen({super.key});

  @override
  State<DonorListScreen> createState() => _DonorListScreenState();
}

class _DonorListScreenState extends State<DonorListScreen> {
  final _searchController = TextEditingController();

  final List<String> _bloodGroupFilters = [
    'All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  @override
  void initState() {
    super.initState();
    final provider = Provider.of<DonorProvider>(context, listen: false);
    _searchController.text = provider.searchQuery;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _confirmDelete(BuildContext context, Donor donor) {
    const darkText = Color(0xFF111827);
    const primaryRed = Color(0xFFDC2626);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: primaryRed),
            SizedBox(width: 8),
            Text(
              'Delete Donor?',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Text(
          'Are you sure you want to remove "${donor.fullName}" from the donor database? This action cannot be undone.',
          style: const TextStyle(color: darkText),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.grey),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: darkText,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () {
              Navigator.of(ctx).pop();
              Provider.of<DonorProvider>(context, listen: false)
                  .deleteDonor(donor.id);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Donor "${donor.fullName}" removed.'),
                  backgroundColor: darkText,
                ),
              );
            },
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _openEditDialog(BuildContext context, Donor donor) {
    showDialog(
      context: context,
      builder: (ctx) => EditDonorDialog(
        donor: donor,
        onSave: (updatedDonor) {
          Provider.of<DonorProvider>(context, listen: false)
              .updateDonor(updatedDonor);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Donor details updated successfully.'),
              backgroundColor: Colors.green,
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const primaryRed = Color(0xFFDC2626);
    const darkText = Color(0xFF111827);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Registered Donors',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/'),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add_alt_1),
            tooltip: 'Add New Donor',
            onPressed: () => context.go('/'),
          ),
        ],
      ),
      body: Consumer<DonorProvider>(
        builder: (context, donorProvider, child) {
          final donors = donorProvider.filteredAndSortedDonors;
          final totalCount = donorProvider.totalDonorsCount;

          return RefreshIndicator(
            color: primaryRed,
            onRefresh: () => donorProvider.refreshDonors(),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 25),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 700),
                  child: Column(
                    children: [
                      // Total Donor Count Banner
                      Text(
                        'Total Donors: $totalCount',
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          color: darkText,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Search Input Field
                      TextField(
                        controller: _searchController,
                        onChanged: (value) {
                          donorProvider.setSearchQuery(value);
                        },
                        style: const TextStyle(fontSize: 16, color: darkText),
                        decoration: InputDecoration(
                          hintText: 'Search by name, blood group, city, phone...',
                          hintStyle: TextStyle(
                            color: Colors.grey.shade400,
                            fontSize: 15,
                          ),
                          filled: true,
                          fillColor: Colors.white,
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 14,
                          ),
                          prefixIcon: const Icon(
                            Icons.search,
                            color: primaryRed,
                          ),
                          suffixIcon: _searchController.text.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(Icons.clear, color: Colors.grey),
                                  onPressed: () {
                                    _searchController.clear();
                                    donorProvider.setSearchQuery('');
                                  },
                                )
                              : null,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(color: Color(0xFFDDDDDD)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(color: Color(0xFFDDDDDD)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: const BorderSide(
                              color: primaryRed,
                              width: 2,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),

                      // Filter & Sort Controls Bar
                      Row(
                        children: [
                          // Blood Group Filter Chip Dropdown
                          Expanded(
                            child: SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: Row(
                                children: _bloodGroupFilters.map((group) {
                                  final isSelected =
                                      donorProvider.selectedBloodGroupFilter ==
                                          group;
                                  return Padding(
                                    padding: const EdgeInsets.only(right: 6.0),
                                    child: ChoiceChip(
                                      label: Text(group),
                                      selected: isSelected,
                                      selectedColor: primaryRed,
                                      backgroundColor: Colors.white,
                                      labelStyle: TextStyle(
                                        color: isSelected
                                            ? Colors.white
                                            : darkText,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      onSelected: (selected) {
                                        if (selected) {
                                          donorProvider
                                              .setBloodGroupFilter(group);
                                        }
                                      },
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),

                          // Sort Option Menu
                          PopupMenuButton<SortOption>(
                            icon: const Icon(Icons.sort, color: primaryRed),
                            tooltip: 'Sort Donors',
                            onSelected: (option) =>
                                donorProvider.setSortOption(option),
                            itemBuilder: (context) => const [
                              PopupMenuItem(
                                value: SortOption.name,
                                child: Text('Sort by Name'),
                              ),
                              PopupMenuItem(
                                value: SortOption.bloodGroup,
                                child: Text('Sort by Blood Group'),
                              ),
                              PopupMenuItem(
                                value: SortOption.age,
                                child: Text('Sort by Age'),
                              ),
                              PopupMenuItem(
                                value: SortOption.lastDonation,
                                child: Text('Sort by Last Donation Date'),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 15),

                      // Donor Cards List / Empty State
                      if (donorProvider.isLoading)
                        const Padding(
                          padding: EdgeInsets.all(50.0),
                          child: CircularProgressIndicator(color: primaryRed),
                        )
                      else if (donors.isEmpty)
                        _buildEmptyState(context, donorProvider)
                      else
                        ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: donors.length,
                          itemBuilder: (context, index) {
                            final donor = donors[index];
                            return DonorCard(
                              donor: donor,
                              onDelete: () => _confirmDelete(context, donor),
                              onEdit: () => _openEditDialog(context, donor),
                              onToggleAvailability: () => donorProvider
                                  .toggleAvailability(donor.id),
                            );
                          },
                        ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go('/'),
        backgroundColor: primaryRed,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Register Donor',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, DonorProvider provider) {
    const primaryRed = Color(0xFFDC2626);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(40),
      margin: const EdgeInsets.only(top: 20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        children: [
          Icon(
            Icons.nature_people_outlined,
            size: 70,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 15),
          Text(
            provider.searchQuery.isNotEmpty ||
                    provider.selectedBloodGroupFilter != 'All'
                ? 'No donors match your search criteria'
                : 'No Donors Registered Yet',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.grey.shade800,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            provider.searchQuery.isNotEmpty
                ? 'Try adjusting your search terms or filters.'
                : 'Start by registering your first blood donor!',
            style: TextStyle(color: Colors.grey.shade600),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryRed,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            onPressed: () {
              if (provider.searchQuery.isNotEmpty ||
                  provider.selectedBloodGroupFilter != 'All') {
                _searchController.clear();
                provider.setSearchQuery('');
                provider.setBloodGroupFilter('All');
              } else {
                context.go('/');
              }
            },
            icon: const Icon(Icons.add, color: Colors.white),
            label: Text(
              provider.searchQuery.isNotEmpty
                  ? 'Clear Filters'
                  : 'Register New Donor',
              style: const TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
