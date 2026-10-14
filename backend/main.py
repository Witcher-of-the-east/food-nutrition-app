// Minimal working screen to test the connection.
// Copy to lib/main.dart in a test project, or reuse the logic in Abhijeet's screens.
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'api_service.dart';

void main() => runApp(const MaterialApp(home: FoodScreen()));

class FoodScreen extends StatefulWidget {
  const FoodScreen({super.key});
  @override
  State<FoodScreen> createState() => _FoodScreenState();
}

class _FoodScreenState extends State<FoodScreen> {
  final _picker = ImagePicker();
  File? _image;
  List<Map<String, dynamic>> _top3 = [];
  Map<String, dynamic>? _nutrition;
  double _servings = 1;
  bool _loading = false;
  String? _message;

  Future<void> _pick(ImageSource source) async {
    final picked =
        await _picker.pickImage(source: source, maxWidth: 1024, imageQuality: 85);
    if (picked == null) return;
    setState(() {
      _image = File(picked.path);
      _top3 = [];
      _nutrition = null;
      _message = null;
      _loading = true;
    });
    try {
      final result = await ApiService.predict(_image!);
      setState(() => _top3 = result);
    } catch (e) {
      setState(() => _message = '$e');
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _selectDish(String dish) async {
    setState(() {
      _message = null;
      _nutrition = null;
    });
    try {
      final n = await ApiService.nutrition(dish);
      setState(() {
        _nutrition = n;
        _servings = 1;
      });
    } catch (e) {
      setState(() => _message = '$e');
    }
  }

  Future<void> _save() async {
    final n = _nutrition!;
    final calories = (n['calories'] as num) * _servings;
    try {
      await ApiService.saveMeal(n['dish'] as String, _servings, calories.toDouble());
      if (!mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Meal saved')));
    } catch (e) {
      setState(() => _message = '$e');
    }
  }

  @override
  Widget build(BuildContext context) {
    final n = _nutrition;
    return Scaffold(
      appBar: AppBar(title: const Text('Food Photo')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_image != null) Image.file(_image!, height: 220, fit: BoxFit.cover),
            const SizedBox(height: 12),
            Row(children: [
              Expanded(
                  child: ElevatedButton(
                      onPressed: () => _pick(ImageSource.camera),
                      child: const Text('Camera'))),
              const SizedBox(width: 12),
              Expanded(
                  child: ElevatedButton(
                      onPressed: () => _pick(ImageSource.gallery),
                      child: const Text('Gallery'))),
            ]),
            if (_loading)
              const Padding(
                  padding: EdgeInsets.all(16),
                  child: Center(child: CircularProgressIndicator())),
            if (_message != null)
              Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Text(_message!, style: const TextStyle(color: Colors.red))),
            if (_top3.isNotEmpty) ...[
              const SizedBox(height: 16),
              const Text('Is it one of these?',
                  style: TextStyle(fontWeight: FontWeight.bold)),
              ..._top3.map((d) => ListTile(
                    title: Text('${d['dish']}'),
                    subtitle: Text(
                        '${((d['confidence'] as num) * 100).toStringAsFixed(0)}% sure'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => _selectDish(d['dish'] as String),
                  )),
            ],
            if (n != null) ...[
              const Divider(),
              Text('${n['dish']}  (1 serving = ${n['serving']})',
                  style: const TextStyle(fontWeight: FontWeight.bold)),
              Slider(
                value: _servings,
                min: 0.5,
                max: 4,
                divisions: 7,
                label: '$_servings servings',
                onChanged: (v) => setState(() => _servings = v),
              ),
              Text('Servings: $_servings'),
              Text('Calories: ${((n['calories'] as num) * _servings).toStringAsFixed(0)} kcal'),
              Text('Protein: ${((n['protein_g'] as num) * _servings).toStringAsFixed(1)} g'),
              Text('Carbs: ${((n['carbs_g'] as num) * _servings).toStringAsFixed(1)} g'),
              Text('Fat: ${((n['fat_g'] as num) * _servings).toStringAsFixed(1)} g'),
              const SizedBox(height: 12),
              ElevatedButton(onPressed: _save, child: const Text('Save meal')),
            ],
          ],
        ),
      ),
    );
  }
}