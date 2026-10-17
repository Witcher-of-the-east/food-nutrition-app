from huggingface_hub import hf_hub_download, HfApi
import json

models = [
    "DrishtiSharma/finetuned-ViT-Indian-Food-Classification-v3",
    "rajistics/finetuned-indian-food",
    "Ariana03/finetuned-indian-food",
    "Vishnu-add/finetuned-indian-food",
    "nateraw/food",
]

api = HfApi()
for m in models:
    print("=" * 60)
    print(m)
    try:
        cfg = json.load(open(hf_hub_download(m, "config.json")))
        labels = list(cfg.get("id2label", {}).values())
        print("classes:", len(labels))
        print("first 15:", labels[:15])
        files = api.list_repo_files(m)
        print("has preprocessor_config.json:", "preprocessor_config.json" in files)
    except Exception as e:
        print("could not read:", str(e)[:150])